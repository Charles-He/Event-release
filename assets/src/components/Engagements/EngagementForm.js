import { useState, useContext, useEffect, useCallback } from 'react';

import AuthContext from '../../store/auth-context';
import Errors from '../Errors/Errors';

const EngagementForm = (props) => {
  const authContext = useContext(AuthContext);

  const [titleValue, setTitleValue] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [siteValue, setSiteValue] = useState('');
  const [addressValue, setAddressValue] = useState('');


  const [errors, setErrors] = useState({});

  const populateFields = useCallback(() => {
    if (props.engagement) {
      setTitleValue(props.engagement.Title);
      setTimeValue(props.engagement.Time);
      setSiteValue(props.engagement.Site);
      setAddressValue(props.engagement.Address);
    }
  }, [props.engagement]);

  useEffect(() => {
    populateFields();
  }, [populateFields]);

  async function submitHandler(event) {
    event.preventDefault();
    setErrors({});

    try {
      const method = props.onEditEngagement ? 'PUT' : 'POST';
      let body = {
        Title: titleValue,
        Time: timeValue,
        Site: siteValue,
        Address: addressValue,
      }
      if (props.onEditEngagement) {
        body.ID = props.engagement.ID;
      }
      const response = await fetch('api/engagements',
        {
          method: method,
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authContext.token,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        let errorText = 'Failed to add new engagement.';
        if (!data.hasOwnProperty('error')) {
          throw new Error(errorText);
        }
        if ((typeof data['error'] === 'string')) {
          setErrors({ 'unknown': data['error'] })
        } else {
          setErrors(data['error']);
        }
      } else {
        setTitleValue('');
        setTimeValue('');
        setSiteValue('');
        setAddressValue('');
        if (props.onAddEngagement) {
          props.onAddEngagement(data.data);
        }
        if (props.onEditEngagement) {
          props.onEditEngagement(data.data);
        }
      }
    } catch (error) {
      setErrors({ "error": error.message });
    }
  };

  const titleChangeHandler = (event) => { setTitleValue(event.target.value) }
  const timeChangeHandler = (event) => { setTimeValue(event.target.value) }
  const siteChangeHandler = (event) => { setSiteValue(event.target.value) }
  const addressChangeHandler = (event) => { setAddressValue(event.target.value) }

  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);
  const submitButtonText = props.onEditEngagement ? '确定更新' : '发布新活动';

  return (
    <section>
      <div className="container w-75 pb-4">
        <form onSubmit={submitHandler}>
          <div className="form-group pb-3">
            <label htmlFor="title">活动名称</label>
            <input id="title" type="text" className="form-control" required value={titleValue} onChange={titleChangeHandler}></input>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="time">活动时间</label>
            <textarea id="time" className="form-control" rows="3" required value={timeValue} onChange={timeChangeHandler}></textarea>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="site">活动地点</label>
            <textarea id="site" className="form-control" rows="1" required value={siteValue} onChange={siteChangeHandler}></textarea>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="address">活动地址</label>
            <textarea id="address" className="form-control" rows="1" required value={addressValue} onChange={addressChangeHandler}></textarea>
          </div>
          <button type="submit" className="btn btn-success">{submitButtonText}</button>
        </form>
        {errorContent}
      </div>
    </section>
  );
}

export default EngagementForm;
