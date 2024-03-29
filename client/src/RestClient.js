/* eslint-disable */
import {
    GET_LIST,
    GET_MATCHING,
    GET_ONE,
    GET_MANY,
    CREATE,
    UPDATE,
    DELETE
} from 'admin-on-rest';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

export default (type, resource, params) => {
    console.log(type, resource, params);
    switch (type) {
        case GET_LIST:
            return fetch(`/${resource}/?filter=${params.filter.q}`).then(checkStatus).then(json => {
                return {
                    data: json.map(x => {x.id = x.Id; return x;}),
                    total: json.length
                }
            });
            break;
        case UPDATE:
            return fetch(`/${resource}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify(params.data)
                    });
            break;
        case GET_MATCHING:
        case GET_ONE:
            return fetch(`/${resource}/?id=${params.id}`).then(checkStatus).then(json => {
                return fetch(`/email-templates/?id=${params.id}`).then(response => response.json()).then(emailTemplates => {
                    let courseEmail = emailTemplates.filter(val => val.Type === "OnlineBookingCustomerCourse");
                    let sessionEmail = emailTemplates.filter(val => val.Type === "OnlineBookingCustomerSession");
                    return json.map(x => {
                                x.id = x.Id;
                                x.courseEmailSubject = courseEmail[0] ? courseEmail[0].Subject : '';
                                x.courseEmailBody = courseEmail[0] ? courseEmail[0].Body : '';
                                x.courseEmailId = courseEmail[0] ? courseEmail[0].Id : '';
                                x.sessionEmailSubject = sessionEmail[0] ? sessionEmail[0].Subject : '';
                                x.sessionEmailBody = sessionEmail[0] ? sessionEmail[0].Body : '';
                                x.sessionEmailId = sessionEmail[0] ? sessionEmail[0].Id : '';
                                return x;
                            })[0]
                });
            });
        break;
        case GET_MANY:
        case CREATE:
        case DELETE:
            break;
        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }
};