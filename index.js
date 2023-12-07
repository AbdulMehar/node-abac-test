const NodeAbac = require('node-abac');

async function main() {

    
    const Abac = new NodeAbac(['./policy.json']);

    console.log(Abac.getRuleAttributes('can-be-admin-of-group'))

    let subject = {
        user: {
            active: true,
            dob: '1991-05-12',
            banCount: 0,
            group: 12
        }
    };
    let resource = {
        group: {
            id: 12
        }
    };
    
    const permit = Abac.enforce('can-be-admin-of-group', subject, resource); // returns true
    console.log(permit)
}

async function main2() {

    
    const Abac = new NodeAbac(['./policy2.json']);

    console.log(Abac.getRuleAttributes('can-add-users'))

    let subject1 = {
        user: {
            entity: 12,
            userType: "Liaison"
        }
    };

    
    let resource = {
        entity: {
            id: 12,
            childs: [13,14,15]
        }
    };

    
    let permit = Abac.enforce('can-add-users', subject1, resource); // returns true
    console.log(`subject1 can add users ${permit}`)

    let subject2 = {
        user: {
            entity: 12,
            userType: "Normal"
        }
    };
    
    permit = Abac.enforce('can-add-users', subject2, resource); // returns true
    console.log(`subject2 can add users ${permit}`)

    let subject3 = {
        user: {
            entity: 12,
            userType: "supplier"
        }
    };

    permit = Abac.enforce('can-submit-transactions', subject3, resource); // returns true
    console.log(`subject3 is a supplier, so can it submit transactions: ${permit}`)

    
    let subject4 = {
        user: {
            entity: 14,
        }
    };

    permit = Abac.enforce('can-manage-entity', subject4, resource); // returns true
    console.log(`subject4 can manage childs of entity: ${permit}`)

    


}


main2()