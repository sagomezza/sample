export const components = {
    components: {
        schemas: {
            id: {
                type: "string", // data type
                description: "An id of model", // desc
                example: "tyVgf", // example of an id
            },
            Certificate: {
                type: 'object',
                properties: {
                    order_id: {
                        type: 'string',
                        description: 'The order ID associated to the certificate. Each certificate must has one.',
                        example: '5678ghjk098jm-6789'
                    },
                    name: {
                        type: 'string',
                        description: 'The name of the certificate.',
                        example: 'Spanish basics 1'
                    },
                    degree: {
                        type: 'string',
                        description: 'The degree granted to the student by getting this certificate.',
                        example: 'Spanish B1'
                    },
                    students_id: {
                        type: '[string]',
                        description: `The associated students' IDs to the certifcate.`,
                        example: '[ 2345678sfdfd, 67890dfasdf ]'
                    }
                }
            },
            Lu_Code: {
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                        description: 'The country name',
                        example: 'US'
                    },
                    flag: {
                        type: 'string',
                        description: 'The URL to flag image associated to this country',
                    },
                    calling_code: {
                        type: 'string',
                        description: 'The calling code assigned to this country',
                        example: '+1'
                    }
                }
            },
            Order: {
                type: 'object',
                properties: {
                    requestedBy: {
                        type: 'string',
                        description: 'The user id of the person who requested an order',
                        example: '456789fghjk-6789jk'
                    },
                    details: {
                        type: 'string',
                        description: 'The special details for the order',
                    },
                    students: {
                        type: '[object]',
                        description: 'An array of objects containing the students data',
                    }
                }
            },
            Organization: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The organizations name',
                        example: 'School of languages'
                    },
                    countryId: {
                        type: 'string',
                        description: 'The country where the organization is located',
                        example: 'US'
                    },
                    provinceId: {
                        type: 'string',
                        description: 'The province or state of the country where the organization is located',
                        example: 'NY'
                    }
                }
            },
            Province: {
                type: 'object',
                properties: {
                    province: {
                        type: 'string',
                        description: 'The province name',
                        example: 'NY'
                    },
                    country: {
                        type: 'string',
                        description: 'The country where the province is located',
                        example: 'US'
                    },
                    flag: {
                        type: 'string',
                        description: 'The URL to flag image associated to this province',
                    },
                    calling_code: {
                        type: 'string',
                        description: 'The calling code assigned to this province',
                        example: '+1'
                    }
                }
            },
            User: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: `The user's name`,
                        example: 'Adam'
                    },
                    last_name: {
                        type: 'string',
                        description: `The user's lastname`,
                        example: 'Smith'
                    },
                    email: {
                        type: 'string',
                        description: `The user's email`,
                        example: 'email@example.com'
                    },
                    password: {
                        type: 'string',
                        description: 'The encrypted password provided by the user',
                    },
                    org_id: {
                        type: 'string',
                        description: 'The ID of the organization associated with the student',
                        example: '+1'
                    },
                    type: {
                        type: 'string',
                        description: 'Type of the user',
                    },
                    registarInfo: {
                        type: 'string',
                        description: 'The special information stored if the user is registar',
                    },
                    applicantInfo: {
                        type: 'string',
                        description: 'The special information stored if the user is applicant',
                    }
                }
            }
        },
        requestBodies: {
            certificatePut: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The name of the certificate.',
                        example: 'Spanish basics 1'
                    },
                    degree: {
                        type: 'string',
                        description: 'The degree granted to the student by getting this certificate.',
                        example: 'Spanish B1'
                    },
                }
            },
            Lu_CodePut: {
                type: 'object',
                properties: {
                    flag: {
                        type: 'string',
                        description: 'The URL to flag image associated to this country',
                    },
                    calling_code: {
                        type: 'string',
                        description: 'The calling code assigned to this country',
                        example: '+1'
                    },
                }
            },
            provincePut: {
                type: 'object',
                properties: {
                    country: {
                        type: 'string',
                        description: 'The country where the province is located',
                        example: 'US'
                    },
                    flag: {
                        type: 'string',
                        description: 'The URL to flag image associated to this province',
                    },
                    calling_code: {
                        type: 'string',
                        description: 'The calling code assigned to this province',
                        example: '+1'
                    }
                }
            },
            userPut: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: `The user's name`,
                        example: 'Adam'
                    },
                    last_name: {
                        type: 'string',
                        description: `The user's lastname`,
                        example: 'Smith'
                    },
                    email: {
                        type: 'string',
                        description: `The user's email`,
                        example: 'email@example.com'
                    },
                    password: {
                        type: 'string',
                        description: 'The encrypted password provided by the user',
                    },
                    org_id: {
                        type: 'string',
                        description: 'The ID of the organization associated with the student',
                        example: '+1'
                    },
                }
            }

        }
    }
}