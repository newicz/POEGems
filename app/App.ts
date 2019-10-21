import axios from 'axios'
import POEWikiApi from './POEWikiApi'
import * as fs from 'fs'
import * as path from 'path'

class App {
  gems: Array<any> = []

  async run () {
    console.log('Running')

    this.gems = [
      ...await this.processGemsVendorChunk(POEWikiApi.GEMS_ACTIVE_VENDOR_API_TEMP, 400, 0),
      ...await this.processGemsVendorChunk(POEWikiApi.GEMS_ACTIVE_VENDOR_API_TEMP, 500, 400),
      ...await this.processGemsVendorChunk(POEWikiApi.GEMS_SUPPORT_VENDOR_API_TEMP, 500, 0),
      ...await this.processGemsVendorChunk(POEWikiApi.GEMS_SUPPORT_VENDOR_API_TEMP, 500, 500)
    ]

    await this.processGemsQuestChunk(POEWikiApi.GEMS_ACTIVE_QUEST_API_TEMP, 500, 0)
    await this.processGemsQuestChunk(POEWikiApi.GEMS_SUPPORT_QUEST_API_TEMP, 500, 0)
    /** @TODO Process quest rewards */

    if (await this.assertNoDuplicates()) {
      fs.writeFileSync(path.join(__dirname, '../dist', 'gems.json'), JSON.stringify({ gems: this.gems }, null, 2))

      console.log('\n\n' + this.gems.length + ' gems processed and written to file')
    }

    
  }

  /**
   * Gets chunk of data from the API
   * 
   * @param limit 
   * @param offset 
   */
  async processGemsVendorChunk (api: String, limit: Number, offset: Number): Promise<Array<any>> {
    console.log('Calling API for gems with vendor rewards chunk of data')
    let response = await axios.get(POEWikiApi.getChunkAPI(api, limit, offset))
    let data = response.data.cargoquery
    let gems = []

    console.log('Processing the chunk')
    // Itterate through all the returned gems
    data.forEach(gemData => {
      // Check if the gem was alredy added to the `gems` object
      let gem = gemData.title
      let existingGem = gems.find(g => g.name === gem.name)

      if (existingGem) {
        // If the gem is already in `gems` push new vendor reward to it
        existingGem.vendor_rewards.push({
          npc: gem.npc,
          quest: gem.quest,
          act: gem.act,
          classes: gem.classes.length > 0 ? gem.classes.split('�') : []
        })
      } else {
        // If it's a new gem, create an entry in `gems` object for it
        gems.push({
          name: gem.name,
          required_level: gem['required level'],
          primary_attr: gem['primary attribute'],
          vendor_rewards: [{ 
            npc: gem.npc,
            quest: gem.quest,
            act: gem.act,
            classes: gem.classes.length > 0 ? gem.classes.split('�') : []
          }],
          quest_rewards: []
        })
      }
    })

    return gems
  }

  /**
   * Enriching the gems with the quest reward data
   * 
   * @param api 
   * @param limit 
   * @param offset 
   */
  async processGemsQuestChunk (api: String, limit: Number, offset: Number) {
    console.log('Calling API for gems with quest rewards chunk of data')
    let response = await axios.get(POEWikiApi.getChunkAPI(api, limit, offset))
    let data = response.data.cargoquery

    console.log('Enriching the gems objects')
    data.forEach(gemData => {
      let gem = gemData.title
      let existingGem = this.gems.find(g => g.name === gem.name)

      if (!existingGem) {
        throw new Error('Something gone really wrong, the gems from API seems to not be synchoronized!')
      }

      if (gem.quest.length > 0 || gem.act.length > 0 || gem.classes.length > 0) {
        existingGem.quest_rewards.push({
          quest: gem.quest,
          act: gem.act,
          classes: gem.classes.length > 0 ? gem.classes.split('�') : []
        })
      }
    })
  }

  /**
   * Checks if there is no duplicates in the gems processed from the API.
   * Because we are loading the data in chunks there may be a situation when one gem occure in both chunks.
   */
  async assertNoDuplicates (): Promise<Boolean> {
    if (this.gems.length === 0) {
      console.log('Gems are not loaded in, there is nothing to check, did you forget to call `run()` method?')
      return
    }

    let result = true
    let map = {};

    for (var i = 0; i < this.gems.length; i++) {
        var index = JSON.stringify(this.gems[i].name);
        if (!map[index]) {
            map[index] = 1;
        } else {
            map[index]++;
        }
    }

    for (var key in map) {
        if (map[key] > 1) {
          result = false
          console.log (JSON.parse(key) + 'is duplicated, found: ' + map[key] + ' entries');
        }
    }

    return result
  }
}

export default App