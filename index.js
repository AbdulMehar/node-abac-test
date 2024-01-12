const NodeAbac = require('node-abac');
const express = require('express');

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

const app = express();
const port = 3000;

const users = {
    1: {
        name: "something",
        entityId: "PIU-1",
        role: "PIU-user"
    },
    2: {
        name: "something",
        entityId: "WBG",
        role: "WBG USER"
    },
    
}

const entities = {
    "PIU-1": {
        id: "PIU-1",
        loans: [1,2,3],
        projects: [1,2,3],
        accounts: [1,2,3],
        parent: 'ministry',
        childs: ['sub-piu']
    },
    
    "sub-piu": {
        id: "sub-piu",
        parent: 'PIU-1'
        
    }
}



app.get('/PIU-1', (req, res) => {
    const userId = req.header('userid');

    const subject = {user: users[userId]}
    
    const resource = {entity: entities['PIU-1']}

    const Abac = new NodeAbac(['./policy3.json']);

    const rule = "is-entity-user"
    
    const validate = Abac.enforce(rule,subject, resource)
    

    res.send(`${rule}: ${validate}`);
});

app.get('/SUB-PIU', (req, res) => {
    const userId = req.header('userid');

    const subject = { user: users[userId]}
    
    const entitySubject = {entity: entities[users[userId].entityId]}
    const resource = {entity: entities['sub-piu']}

    const Abac = new NodeAbac(['./policy3.json']);

    const rule = "can-manage-entity"
    const validate = Abac.enforce(rule,entitySubject, resource)
    

    res.send(`${rule}: ${validate}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// main2()