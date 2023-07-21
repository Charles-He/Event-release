import { useContext, useState, useEffect, useCallback } from "react";

import AuthContext from "../../store/auth-context";
import Errors from "../Errors/Errors";
import EngagementForm from "./EngagementForm";
import EngagementsList from "./EngagementsLists";

const Engagements = () => {
  const authContext = useContext(AuthContext);
  const [engagements, setEngagements] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchEngagementsHandler = useCallback(async () => {
    setErrors({});

    try {
      const response = await fetch('/api/engagements',
        {
          headers: {
            'Authorization': 'Bearer ' + authContext.token,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        let errorText = 'Fetching engagements failed.';
        if (!data.hasOwnProperty('error')) {
          throw new Error(errorText);
        }
        if ((typeof data['error'] === 'string')) {
          setErrors({ 'unknown': data['error'] })
        } else {
          setErrors(data['error']);
        }
      } else {
        setEngagements(data.data);
      }
    } catch (error) {
      setErrors({ "error": error.message });
    }
  }, [authContext.token]);

  useEffect(() => {
    fetchEngagementsHandler();
  }, [fetchEngagementsHandler]);

  const addEngagementHandler = (engagementData) => {
    setEngagements((prevState) => { return [...prevState, engagementData] });
  }

  const deleteEngagementHandler = (engagementID) => {
    setEngagements((prevState) => {
      return prevState.filter(engagement => { return engagement.ID !== engagementID; })
    })
  }

  const editEngagementHandler = () => {
    fetchEngagementsHandler();
  }

  const engagementsContent = engagements.length === 0 ?
    <p>No engagements yet</p>
    :
    <EngagementsList
      engagements={engagements}
      onEditEngagement={editEngagementHandler}
      onDeleteEngagement={deleteEngagementHandler} />;

  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);

  return (
    <section>
      <h1 className="pb-4">已发布的活动：</h1>
      <EngagementForm onAddEngagement={addEngagementHandler}/>
      {errorContent}
      {engagementsContent}
    </section>
  );
};

export default Engagements;
