<div id="parentBook"></div>

##### Workbench
The workbench is a place, where you can create new entries or edit existing ones. 
To create a new entry, press the "Create" button. Or to edit an existing entry, press the "Edit" button in the selected row of the table.

###### Requirements
- Title and description have to be valid.
- Level requirement must be greater than 0, if it is not null.
- All features must be validated.
- **Movement**
    - Range must be greater than 0.
    - All effects must be validated.
- **Skill**
    - Range must be greater than 0.
    - It can be 0 only if target is SELF.
    - Area of effect must be greater than or equal to 0.
    - All effects must be validated.
- **Attack**
    - Range must be greater than 0.
    - It can be 0 only if target is SELF.
    - Area of effect must be greater than or equal to 0.
    - Damage must not be negative.
    - Number of attacks must be greater than 0.
    - All effects must be validated.
- **Summon Action**
    - Range must be greater than 0.
    - Summon can't have the same action as the one that summoned it.
    - Summon itself must be validated.
- **Restore Cards**
    - Number of cards must be greater than 0 or exactly -1 (infinity).

###### Usage
To enable each feature, you need to click on a toggle option at the right top corner of the feature. Then you can add configuration of the feature and effects associated with it.
