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

export default (type, resource, params) => {
    console.log(type, resource, params);
    switch (type) {
        case GET_LIST:
            return fetch(`http://localhost:8080/${resource}/?filter=${params.filter.q}`).then(response => response.json()).then(json => {
                return {
                    data: json.map(x => {x.id = x.Id; return x;}),
                    total: json.length
                }
            });
            break;
        case UPDATE:
            return fetch(`http://localhost:8080/${resource}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: "POST",
                        body: JSON.stringify(params.data) })
                    .then(response => response.json()).then(json => {
                        // console.log(json);
                    });
            break;
        case GET_MATCHING:
        case GET_ONE:
            return fetch(`http://localhost:8080/${resource}/?id=${params.id}`).then(response => response.json()).then(json => {
                return fetch(`http://localhost:8080/email-templates/?id=${params.id}`).then(response => response.json()).then(emailTemplates => {
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