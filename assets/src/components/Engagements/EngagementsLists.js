import Engagement from "./Engagement";

const EngagementsList = (props) => {
  return (
    <ul>
      {props.engagements.map((engagement) => (
        <Engagement
          onEditEngagement={props.onEditEngagement}
          onDeleteEngagement={props.onDeleteEngagement}
          key={engagement.ID}
          engagement={engagement} />
      ))}
    </ul>
  );
};

export default EngagementsList;
