import { useState, useContext, useEffect, useCallback } from 'react';
// import { useHistory } from "react-router-dom";

import AuthContext from '../../store/auth-context';
import Errors from '../Errors/Errors';
import EngagementFS from "./EngagementFS";

const Users = (props) => {
    var urlUnits = window.location.pathname.split("/");
    const authContext = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
  
    // console.log(props.engagementId);
  
    const fetchEngagementHandler = useCallback(async () => {
      setErrors({});
  
      try {
        const response = await fetch('../api/subscribedusers/' + urlUnits[2],
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + authContext.token,
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          let errorText = 'Fetching engagement failed.';
          if (!data.hasOwnProperty('error')) {
            throw new Error(errorText);
          }
          if ((typeof data['error'] === 'string')) {
            setErrors({ 'unknown': data['error'] })
          } else {
            setErrors(data['error']);
          }
        } else {
          setUsers(data.data);
        }
      } catch (error) {
        setErrors({ "error": error.message });
      }
    }, [authContext.token]);
  
    useEffect(() => {
      fetchEngagementHandler();
    }, [fetchEngagementHandler]);
  
    console.log(users)
    if (users == null) {
      return (
        <div className="card mb-5 pb-2">
          <EngagementFS
            engagementId={urlUnits[2]} />
          <div> 还没有用户注册</div>
        </div>
      )
    }
    
    const rows = [];
    for (let i = 0; i < users.length; i++) {
      rows.push(
        <tr>
          <th className="card-content">{users[i].FirstName}</th>
          <th className="card-content">{users[i].LastName}</th>
          <th className="card-content">{users[i].Mobile}</th>
          <th className="card-content">{users[i].Email}</th>  
        </tr>
      )
    }
    /*
    const cardTitle = <div>{users.FirstName} </div>;
    const cardTime = <div>活动时间：<br></br>{users.LastName} </div>;
    const cardSite = <div>活动地点：<br></br>{users.Mobile} </div>;
    const cardAddress =  <div>活动地址：<br></br>{users.Email} </div>;
    */
    return (
      <div className="card mb-5 pb-2">
        <EngagementFS
          engagementId={urlUnits[2]} />
          <table>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
            {rows}
          </table>
      </div>
    );
  
    
  
  };

export default Users;
