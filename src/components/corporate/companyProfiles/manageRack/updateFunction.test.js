import updatedFunction from "./updateFunction";

const createTowerLevelLocation = (tower, level, location, allowDuplicateLoc) => {
    const schema = {};
    const { copy: updatedTower } = updatedFunction(schema, 'CREATE', 'TOWER', tower); 
    const { copy: updatedLevel } = updatedFunction(updatedTower, 'CREATE', 'LEVEL', level, tower);
    const { copy: addedLocation } = updatedFunction(updatedLevel, 'CREATE', 'LOCATION', location, tower, level, null, allowDuplicateLoc);
    return addedLocation;
}

describe('updateFunction()', () => {

    let schema = {};

    beforeEach(() => {
        schema = {};
    });

    test('create a tower', () => {
        const tower = 'A';
        const { copy } = updatedFunction(schema, 'CREATE', 'TOWER', tower);
        expect(copy).toEqual({ [tower]: {} });
    });

    test(`don't create a duplicate tower`, () => {
        const tower = 'A';
        const { copy: one } = updatedFunction(schema, 'CREATE', 'TOWER', tower);
        const { copy, success } = updatedFunction(one, 'CREATE', 'TOWER', tower);
        expect(success).toBe(false);
        expect(copy).toEqual({
            'A': {}
        });
    });

    test('create a level', () => {
        const tower = 'A';
        const level = '1';
        const { copy: updatedTower } = updatedFunction(schema, 'CREATE', 'TOWER', tower); 
        const { copy } = updatedFunction(updatedTower, 'CREATE', 'LEVEL', level, tower);
        const compareSchema = {
            [tower]: {
                [level]: {}
            }
        }

        expect(copy).toEqual(compareSchema);

        const { copy: two, success } = updatedFunction(copy, 'CREATE', 'LEVEL', level, tower);
        expect(success).toBe(false);
        expect(two).toEqual(compareSchema);
    });



    test('create a location', () => {
        const tower = 'A';
        const level = '1';
        const location = '01';
        const allowDuplicateLoc = true;
        const addedLocation = createTowerLevelLocation(tower, level, location, allowDuplicateLoc);       
        const { copy } = updatedFunction(addedLocation, 'CREATE', 'LOCATION', location, tower, level);
        const compareSchema = {
            [tower]: {
                [level]: {
                    [location]: {
                        allowDuplicates: allowDuplicateLoc
                    }
                }
            }
        }
        expect(copy).toEqual(compareSchema);

        // const { copy: two, success } = updatedFunction(copy, 'CREATE', 'LOCATION', location, tower, level);
        // expect(success).toBe(false);
        // expect(two).toEqual(compareSchema);
    });

    test('update a location', () => {
        const tower = 'A';
        const level = '1';
        const location = '01';
        const allowDuplicateLoc = false;

        const addedLocation = createTowerLevelLocation(tower, level, location, allowDuplicateLoc);
        const updatedAllowDuplicateOne = !allowDuplicateLoc;
        const { copy: updatedLocation, success: successOne } = updatedFunction(addedLocation, 'UPDATE', 'LOCATION', location, tower, level, location, updatedAllowDuplicateOne);
        expect(successOne).toBe(true);
        expect(addedLocation).toEqual({
            [tower]: {
                [level]: {
                    [location]: {
                        allowDuplicates: updatedAllowDuplicateOne
                    }
                }
            }
        });

        const updatedLocationValue = '02';
        const updatedAllowDuplicateTwo = !updatedAllowDuplicateOne;
        const { copy: updatedLocationTwo, success: successTwo } = updatedFunction(updatedLocation, 'UPDATE', 'LOCATION', updatedLocationValue, tower, level, location, updatedAllowDuplicateTwo);
        expect(successTwo).toBe(true);
        expect(updatedLocationTwo).toEqual({
            [tower]: {
                [level]: {
                    [updatedLocationValue]: {
                        allowDuplicates: updatedAllowDuplicateTwo
                    }
                }
            }
        });
    });

    test('delete a location', () => {
        const tower = 'A';
        const level = '1';
        const location = '01';

        const addedLocation = createTowerLevelLocation(tower, level, location);
        const { copy: deletedLocation } = updatedFunction(addedLocation, 'DELETE', 'LOCATION', null, tower, level, location);
        expect(deletedLocation).toEqual({
            [tower]: {
                [level]: {}
            }
        });
    });

    test('create a special location', () => {
        const specLoc = 'COOL123';
        const { copy } = updatedFunction({}, 'CREATE', 'SPECIAL', specLoc);
        expect(copy).toEqual({
            [specLoc]: {}
        });

        const { copy: tryCreateSameLocation, success } = updatedFunction(copy, 'CREATE', 'SPECIAL', specLoc);
        expect(success).toBe(false);
        expect(copy).toEqual(tryCreateSameLocation);
    });

    test('update a special location', () => {
        const schema = {
            'COOL123': {}
        };
        const value = 'COOL123';

        const { copy, success } = updatedFunction(schema, 'UPDATE', 'SPECIAL', value, '', '', value);
        expect(success).toBe(false);
        expect(copy).toEqual(schema);

        const valueTwo = 'NEW123';
        const { copy: updated, success: successTwo } = updatedFunction(copy, 'UPDATE', 'SPECIAL', valueTwo, '', '', value);

        expect(successTwo).toBe(true);
        expect(updated).toEqual({
            [valueTwo]: {}
        })
    });

    test('delete a special location', () => {
        const schema = {
            'COOL123': {}
        }
        const value = 'COOL123';
        const { copy } = updatedFunction(schema, 'DELETE', 'SPECIAL', value);
        expect(copy).toEqual({});
    });
});