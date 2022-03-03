import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
    describe('Tasks', () => {
      describe('methods', () => {
        const userId = Random.id();
        let taskId;
  
        beforeEach(() => {
          TasksCollection.remove({});
          taskId = TasksCollection.insert({
            text: 'Test Task',
            createdAt: new Date(),
            userId,
          });
        });
      });
    });
  }