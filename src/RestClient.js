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
                // console.log(json);
                return {
                    data: json.map(x => {x.id = x.Id; return x;}),
                    total: json.length
                }
            });
            break;
        case UPDATE:
            return fetch(`http://localhost:8080/${resource}`, {method: "POST", body: params}).then(response => response.json()).then(json => {
                return {
                    data: json.map(x => {x.id = x.Id; return x;}),
                    total: json.length
                }
            });
            break;
        case GET_MATCHING:
        case GET_ONE:
        case GET_MANY:
        case CREATE:
        case DELETE:
            break;
        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }
};