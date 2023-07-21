import { useState, useContext, useEffect, useCallback } from 'react';
// import { useHistory } from "react-router-dom";

import AuthContext from '../../store/auth-context';
import Errors from '../Errors/Errors';
import EngagementFS from "./EngagementFS";

const Subscription = (props) => {
  // console.log(window.location.pathname);
  var urlUnits = window.location.pathname.split("/");
  // console.log(urlUnits[2]);
  const authContext = useContext(AuthContext);
  const [firstNameValue, setFirstNameValue] = useState('');
  const [lastNameValue, setLastNameValue] = useState('');
  const [mobileValue, setMobileValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const [subscriptContent, setSubscriptContent] = useState(<p></p>);

  const [errors, setErrors] = useState({});

  const populateFields = useCallback(() => {
    if (props.engagement) {
      setFirstNameValue(props.engagement.Title);
      setLastNameValue(props.engagement.Time);
      setMobileValue(props.engagement.Site);
      setEmailValue(props.engagement.Address);
    }
  }, [props.engagement]);

  useEffect(() => {
    populateFields();
  }, [populateFields]);


  async function submitHandler(event) {
    event.preventDefault();
    setErrors({});

    try {
      const method = 'PUT'
      let body = {
        FirstName: firstNameValue,
        LastName: lastNameValue,
        Mobile: mobileValue,
        Email: emailValue,
        // EngagementId: urlUnits[2],
      }
      
      const response = await fetch('../api/subscription/' + urlUnits[2],
        {
          method: method,
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authContext.token,
          },
        }
      );
      /*
      .then(response => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
          return Promise.reject('error 404')
        } else {
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .then(data => console.log('data is', data))
      .catch(error => console.log('error is', error));
      */

      const data = await response.json();
      if (!response.ok) {
        let errorText = 'Failed to add new subscription.';
        if (!data.hasOwnProperty('error')) {
          throw new Error(errorText);
        }
        if ((typeof data['error'] === 'string')) {
          setErrors({ 'unknown': data['error'] });
        } else {
          setErrors(data['error']);
          // setErrors({ 'known': data['error'] });
        }
      } else {
        setFirstNameValue('');
        setLastNameValue('');
        setMobileValue('');
        setEmailValue('');
        if (props.onAddEngagement) {
          props.onAddEngagement(data.data);
        }

        setSubscriptContent(<p>注册成功！感谢您的参与！</p>);
      }
    } catch (error) {
      setErrors({ "error": error.message });
    }
  };


  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors);

  const firstNameChangeHandler = (event) => { setFirstNameValue(event.target.value) }
  const lastNameChangeHandler = (event) => { setLastNameValue(event.target.value) }
  const mobileChangeHandler = (event) => { setMobileValue(event.target.value) }
  const emailChangeHandler = (event) => { setEmailValue(event.target.value) }

  const submitButtonText = '点击参加';

  

  return (
    <section>
      {subscriptContent}
      <EngagementFS
          engagementId={urlUnits[2]} />
      <div className="container w-75 pb-4">
        <form onSubmit={submitHandler}>
          <label>请完整填写您的注册信息</label>
          <div className="form-group pb-3">
            <label htmlFor="firstName">First Name 请填写您的名字</label>
            <input id="firstName" type="text" className="form-control" required value={firstNameValue} onChange={firstNameChangeHandler}></input>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="lastName">Last Name 请填写您的姓氏</label>
            <textarea id="lastName" className="form-control" rows="1" required value={lastNameValue} onChange={lastNameChangeHandler}></textarea>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="mobile">Mobile Number 请按照下方示例填您的手机号</label>
            <textarea id="mobile" className="form-control" rows="1" required value={mobileValue} onChange={mobileChangeHandler}></textarea>
          </div>
          <div className="form-group pb-3">
            <label htmlFor="email">Email 请填写您的电子邮箱</label>
            <textarea id="email" className="form-control" rows="1" required value={emailValue} onChange={emailChangeHandler}></textarea>
          </div>
          <button type="submit" className="btn btn-success">{submitButtonText}</button>
        </form>
        {errorContent}
      </div>
    </section>
  );
}

export default Subscription;
