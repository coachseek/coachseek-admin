import React from 'react';
import { List, EmailField, TextField, DateField, DisabledInput, DateInput, TextInput, EditButton, Edit, Filter} from 'admin-on-rest/lib/mui';

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
        <TextField label="id" source="id" />
        <TextField label="name" source="Name" />
        <DateField label="Authorised Until" source="AuthorisedUntil"></DateField>
        <EmailField label="Merchant Email" source="MerchantAccountIdentifier" />
        <EditButton />
    </List>
);

export const BusinessEdit = (props) => (
    <Edit title={BusinessTitle} {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Name" source="Name" />
        <DateInput label="Publication date" source="AuthorisedUntil" />
        <DisabledInput label="Merchant Email" source="MerchantAccountIdentifier" />
    </Edit>
);