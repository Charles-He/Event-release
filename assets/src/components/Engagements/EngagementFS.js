import { useState, useContext, useEffect, useCallback } from 'react';
// import { useHistory } from "react-router-dom";

import AuthContext from '../../store/auth-context';
// import Errors from '../Errors/Errors';
// import EngagementForm from "./EngagementForm";
// import Subscription from "./Subscription"

const EngagementFS = (props) => {

  const authContext = useContext(AuthContext);
  const [engagement, setEngagement] = useState([]);
  const [errors, setErrors] = useState({});

  // console.log(props.engagementId);

  const fetchEngagementHandler = useCallback(async () => {
    setErrors({});

    try {
      const response = await fetch('../api/engagement/' + props.engagementId,
        {
          method: 'GET',
          headers: {
            // 'Authorization': 'Bearer ' + authContext.token,
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
        setEngagement(data.data);
      }
    } catch (error) {
      setErrors({ "error": error.message });
    }
  }, [authContext.token]);

  useEffect(() => {
    fetchEngagementHandler();
  }, [fetchEngagementHandler]);

  const cardTitle = <div>{engagement.Title} </div>;
  const cardTime = <div>活动时间：<br></br>{engagement.Time} </div>;
  const cardSite = <div>活动地点：<br></br>{engagement.Site} </div>;
  const cardAddress =  <div>活动地址：<br></br>{engagement.Address} </div>;
  
  return (
    <div className="card mb-5 pb-2">
      <div className="card-header">{cardTitle}</div>
      <div className="card-content">{cardTime}</div>
      <div className="card-content">{cardSite}</div>
      <div className="card-content">{cardAddress}</div>
    </div>
  );

  

};

export default EngagementFS;
