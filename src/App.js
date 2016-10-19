import React from 'react';

import { Admin, Resource } from 'admin-on-rest';

import { BusinessList, BusinessEdit } from './components/business';
import RestClient from './RestClient';

const App = () => (
    <Admin restClient={RestClient}>
        <Resource name="business" list={BusinessList} edit={BusinessEdit}/>
    </Admin>
);

export default App;