import { Meteor } from 'meteor/meteor'
import React, {useState, Fragment} from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '../api/TasksCollection';
import { Task } from './Task.jsx';
import {TaskForm} from './TaskForm';
import { LoginForm } from './LoginForm';

const toogleChecked = ({_id, isChecked}) => {
  Meteor.call('tasks.setIsChecked',_id, !isChecked)
};

const deleteTask = ({_id}) => {
  Meteor.call('tasks.remove',_id)
};


export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const user = useTracker(() => Meteor.user() )

  const hideCompletedFilter =  {isChecked : { $ne: true }};

  const userFilter = user ? { userId: user._id} : {};
  
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const tasks = useTracker(() => {
    if (!user) {
      return [];
    }   
    return TasksCollection.find(hideCompleted ? hideCompletedFilter: {}, 
      {
      sort: { createdAt: -1 }
      }
      ).fetch()
  });

  const pendingTasksCount = useTracker(() => {
    if (!user) {
      return 0;
    }

    return TasksCollection.find(pendingOnlyFilter).count();

  })
  

  const logout = () => Meteor.logout();

  return(
  <div className='app'>
    <header>
      <div className='app-bar'>
        <div className='app-header'>
          <h1>📝️ Todo APP!</h1>
        </div>
      </div>
    </header>
    <div className='main'>
      {user ? (
        <Fragment> 
          <div className='user' onClick={logout}>
             {user.username} 🚪
          </div>
          <TaskForm user={user}/>
          <div className='filter'>
            <button onClick={() => setHideCompleted(!hideCompleted)}>
              {hideCompleted ? 'Show ALL' : 'Hide completed'}
            </button>
          </div>
          <ul className='tasks'>
            { tasks.map(task => (
              <Task 
                key={ task._id } 
                task={ task } 
                onCheckboxClick={toogleChecked}
                onDeleteClick = {deleteTask}
              />
            ))}
          </ul>
        </Fragment>
      ) : (
        <LoginForm/>
      )
      }
        
    </div>
  </div>
  )
};
