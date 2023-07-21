import { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";

import AuthContext from '../../store/auth-context';
import Errors from '../Errors/Errors';
import EngagementForm from "./EngagementForm";
// import Subscription from "./Subscription"

const Engagement = (props) => {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const authContext = useContext(AuthContext);

  const switchModeHandler = () => {
    setEditing((prevState) => !prevState);
    setErrors({});
  };

  let navigate = useHistory(); 
  const subscriptionHandler = () =>{ 
    let path = '/subscription/' + props.engagement.ID; 
    navigate.push(path);
  }

  const viewUsersHandler = () =>{ 
    let path = '/users/' + props.engagement.ID; 
    navigate.push(path);
  }

  async function deleteHandler() {
    try {
      const response = await fetch('api/engagements/' + props.engagement.ID,
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + authContext.token,
          },
        }
      );
      const data = await response.json();

      // for deleting subscribed users
      const responseS = await fetch('api/subscribedusers/' + props.engagement.ID,
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + authContext.token,
          },
        }
      );
      const dataS = await responseS.json();
      // end

      if (!response.ok) {
        let errorText = 'Failed to delete the engagement.';
        if (!data.hasOwnProperty('error')) {
          throw new Error(errorText);
        }
        if ((typeof data['error'] === 'string')) {
          setErrors({ 'unknown': data['error'] })
        } else {
          setErrors(data['error']);
        }
      } else {
        props.onDeleteEngagement(props.engagement.ID);
      }
    

      // for deleting subscribedusers
      if (!responseS.ok) {
        let errorText = 'Failed to delete subscribedusers.';
        if (!dataS.hasOwnProperty('error')) {
          throw new Error(errorText);
        }
        if ((typeof dataS['error'] === 'string')) {
          setErrors({ 'unknown': dataS['error'] })
        } else {
          setErrors(dataS['error']);
        }
      }// end
    } catch (error) {
      setErrors({ "error": error.message });
    }
  

  };

  const editEngagementHandler = () => {
    setEditing(false);
    props.onEditEngagement();
  }

  const cardTitle = editing ? '更新活动' : <div>活动名称：{props.engagement.Title} </div>;
  const cardTime = editing ? <EngagementForm engagement={props.engagement} onEditEngagement={editEngagementHandler} editing={true}/> : <div>活动时间：{props.engagement.Time} </div>;
  const cardSite = editing ? <EngagementForm engagement={props.engagement} onEditEngagement={editEngagementHandler} editing={true}/> : <div>活动地点：{props.engagement.Site} </div>;
  const cardAddress = editing ? <EngagementForm engagement={props.engagement} onEditEngagement={editEngagementHandler} editing={true}/> : <div>活动地址：{props.engagement.Address} </div>;
  const cardContent = editing ? <EngagementForm engagement={props.engagement} onEditEngagement={editEngagementHandler} editing={true}/> : <div></div>;
  const switchModeButtonText = editing ? '取消' : '更新';
  const cardButtons = editing ?
    <div className="container">
      <button type="button" className="btn btn-link" onClick={switchModeHandler}>{switchModeButtonText}</button>
      <button type="button" className="btn btn-danger float-right mx-3" onClick={deleteHandler}>删除</button>
    </div>
    :
    <div className="container">
      <button type="button" className="btn btn-link" onClick={switchModeHandler}>{switchModeButtonText}</button>
      <button type="button" className="btn btn-link" onClick={subscriptionHandler}>活动登记页面</button>
      <button type="button" className="btn btn-link" onClick={viewUsersHandler}>已登记用户</button>
      <button type="button" className="btn btn-danger float-right mx-3" onClick={deleteHandler}>删除</button>
    </div>
  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);

  if (editing) {
    return (
      <div className="card mb-5 pb-2">
      <div className="card-header">{cardTitle}</div>
      <div className="card-content">{cardContent}</div>
      {cardButtons}
      {errorContent}
    </div>
    );
  } else {

  return (
    <div className="card mb-5 pb-2">
      <div className="card-header">{cardTitle}</div>
      <div className="card-content">{cardTime}</div>
      <div className="card-content">{cardSite}</div>
      <div className="card-content">{cardAddress}</div>
      {cardButtons}
      {errorContent}
    </div>
  );

  }

};

export default Engagement;
