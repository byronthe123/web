export const user = [{
    name: '',
    value: 'logoUrl',
    image: true
}, {
    name: 'Title',
    value: 'title'
}, {
    name: 'Link',
    value: 'link'
}];

export const system = [...user, {
    name: 'Created by',
    value: 'createdBy',
    email: true
},  {
    name: 'Created',
    value: 'createdAt',
    datetime: true,
    utc: true
}, {
    name: 'Modified by',
    value: 'createdBy',
    email: true
}, {
    name: 'Modified',
    value: 'modifiedAt',
    datetime: true,
    utc: true
}];