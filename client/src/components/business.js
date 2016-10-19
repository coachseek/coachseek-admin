import React from 'react';
import { List, EmailField, TextField, DateField, DisabledInput, DateInput, TextInput, EditButton, Edit, Filter, LongTextInput} from 'admin-on-rest/lib/mui';

const BusinessTitle = ({ record }) => {
    return <span>Edit {record ? `"${record.Name}"` : ''}</span>;
};

const BusinessFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

export const BusinessList = (props) => (
    <List title="All users" {...props} filter={BusinessFilter}>
        <TextField label="id" source="Id" />
        <TextField label="name" source="Name" />
        <DateField label="Authorised Until" source="AuthorisedUntil"></DateField>
        <EmailField label="Merchant Email" source="MerchantAccountIdentifier" />
        <EditButton />
    </List>
);

export const BusinessEdit = (props) => (
    <Edit title={BusinessTitle} {...props}>
        <DisabledInput label="Id" source="Id" />
        <TextInput label="Name" source="Name" />
        <DateInput label="Authorized until" source="AuthorisedUntil" />
        <TextInput label="Merchant Email" source="MerchantAccountIdentifier" />

        <TextInput label="Session Email Subject" source="sessionEmailSubject" />
        <LongTextInput label="Session Email" source="sessionEmailBody"/>
        <TextInput label="Course Email Subject" source="courseEmailSubject" />
        <LongTextInput label="Course Email" source="courseEmailBody"/>

    </Edit>
);