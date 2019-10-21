# POEGems
POEGems is a simple console application that allows you to dump a JSON with all the gems available in the Path Of Exile with some important information about them. The gems list includes vendor rewards as well as quest rewards and respective primary stat that determines the color of the gem.

It is easily extensible and if some additional data is needed it would be fairly easy to add it to the JSON.

The Gem data comes from POE Wiki pages trough the cargo query API.

## JSON Structure

The structure of the gem can be found below along with some example.
```json
{
    "gems": [
        {
          "name": "Name of the gem",
          "required_level": "Required level of the gem",
          "primary_attr": "Gems primary stat (define color of the gem)",
          "vendor_rewards": [
            {
              "npc": "Name of the NPC",
              "quest": "Quest after which reward is accessible",
              "act": "Act number",
              "classes": "Array of classes the gem is available for"
            }
          ],
          "quest_rewards": [
            {
              "quest": "Name of the quest for which the gem is a reward",
              "act": "Act number",
              "classes": "Array of classes that have this gem as a reward"
            }
          ]
        },
        ...
    ]
}
```
Example of the gem in the JSON
```
{
  "gems": [
        {
          "name": "Abyssal Cry",
          "required_level": "34",
          "primary_attr": "strength",
          "vendor_rewards": [
            {
              "npc": "Lilly Roth",
              "quest": "Fallen from Grace",
              "act": "6",
              "classes": []
            },
            {
              "npc": "Petarus and Vanja",
              "quest": "Breaking the Seal",
              "act": "4",
              "classes": []
            }
          ],
          "quest_rewards": [
            {
              "quest": "Breaking the Seal",
              "act": "4",
              "classes": [
                "Witch",
                "Templar",
                "Marauder",
                "Duelist",
                "Ranger",
                "Shadow",
                "Scion"
              ]
            }
          ]
        },
        ...
    ]
}
```

## How to run it yourself

### Prerequisite
 * You need to have [Node](https://nodejs.org/en/) installed on your machine

### Installation
You need to run those command in the command line:
```sh
git clone https://github.com/newicz/POEGems.git
cd POEGems
npm install
```

### Running the script
You need to run this command in the command line, in the folder of the app
```sh
npm run start
```
In the effect there will be a file generated in `dist/` folder called `gems.json`.
 
## Ready file
There is already `gmes.json` committed into the repository (in `dist/` folder), but I am not giving any guarantee, that it is up-to-date. It is always better to run the script yourself.