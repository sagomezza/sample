export const paths = {
    paths: {
        '/certificate': {
            post: {
                tags: ['Certificate CRUD operations'],
                description: 'POST operation that creates a certificate for the specified orders',
                operationId: 'Certificate.post',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Certificate",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Certificate created',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Certificate", // Todo model
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            },
            put: {
                tags: ['Certificate CRUD operations'],
                description: 'PUT operation that updates a certificate with specified data',
                operationId: 'Certificate.put',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/requestBodies/certificatePut",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Certificate data were updated',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    message: {
                                        type: 'string'
                                    }
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            }
        },
        '/certificate/{id}': {
            get: {
                tags: ['Certificate CRUD operations'],
                description: 'GET operation that returns a certificate for the provided ID',
                operationId: 'Certificate.get',
                parameters: [
                    {
                        name: "id", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single certificate id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'Certificate data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Certificate", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            },
            post : {
                tags: ['Certificate CRUD operations'],
                description: 'POST operation that returns a certificate for the provided ID',
                operationId: 'Certificate.get',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/id",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Certificate data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Certificate", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        'listCertificate/{uid}': {
            get: {
                tags: ['Certificate CRUD operations'],
                description: 'GET operation that returns a list of certificates for the provided user ID',
                operationId: 'listCertificates',
                parameters: [
                    {
                        name: "uid", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single user id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'Certificates data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Certificate", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        '/lu_code': {
            post: {
                tags: ['Lu_Code CRUD operations'],
                description: 'POST operation that creates a Lu_Code',
                operationId: 'Lu_Code.post',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Lu_Code",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Lu_Code created',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Lu_Code", // Todo model
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            },
            put: {
                tags: ['Lu_Code CRUD operations'],
                description: 'PUT operation that updates a Lu_Code with specified data',
                operationId: 'Lu_Code.put',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/requestBodies/Lu_CodePut",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Lu_Code data were updated',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    message: {
                                        type: 'string'
                                    }
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            }
        },
        '/lu_code/{id}': {
            get: {
                tags: ['Lu_Code CRUD operations'],
                description: 'GET operation that returns a Lu_Code for the provided ID',
                operationId: 'Lu_Code.get',
                parameters: [
                    {
                        name: "id", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single Lu_Code id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'User data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Lu_Code", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        '/order': {
            post: {
                tags: ['Order CRUD operations'],
                description: 'POST operation that creates a Order',
                operationId: 'Order.post',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Order",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Order created',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Order", // Todo model
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            },
        },
        '/order/{id}': {
            get: {
                tags: ['Order CRUD operations'],
                description: 'GET operation that returns a Order for the provided ID',
                operationId: 'Order.get',
                parameters: [
                    {
                        name: "id", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single Order id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'Order data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Order", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        '/organization': {
            post: {
                tags: ['Organization CRUD operations'],
                description: 'POST operation that creates a Organization',
                operationId: 'Organization.post',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Organization",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Organization created',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Organization", // Todo model
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            },
            put: {
                tags: ['Organization CRUD operations'],
                description: 'PUT operation that updates a Organization with specified data',
                operationId: 'Organization.put',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Organization",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Organization data was updated',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    message: {
                                        type: 'string'
                                    }
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            }
        },
        '/organization/{id}': {
            get: {
                tags: ['Organization CRUD operations'],
                description: 'GET operation that returns a Organization for the provided ID',
                operationId: 'Organization.get',
                parameters: [
                    {
                        name: "id", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single Organization id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'Organization data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Organization", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        '/province': {
            post: {
                tags: ['Province CRUD operations'],
                description: 'POST operation that creates a Province',
                operationId: 'Province.post',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Province",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Province created',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Province", // Todo model
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            },
            put: {
                tags: ['Province CRUD operations'],
                description: 'PUT operation that updates a Province with specified data',
                operationId: 'Province.put',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/requestBodies/provincePut",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'Province data was updated',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    message: {
                                        type: 'string'
                                    }
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            }
        },
        '/province/{id}': {
            get: {
                tags: ['Province CRUD operations'],
                description: 'GET operation that returns a Province for the provided ID',
                operationId: 'Province.get',
                parameters: [
                    {
                        name: "id", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single Province id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'Province data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Province", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        '/user': {
            post: {
                tags: ['User CRUD operations'],
                description: 'POST operation that creates a User',
                operationId: 'User.post',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/User",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'User created',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User", // Todo model
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            },
            put: {
                tags: ['User CRUD operations'],
                description: 'PUT operation that updates a User with specified data',
                operationId: 'User.put',
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/requestBodies/userPut",
                            },
                        },
                    },
                },
                response: {
                    200: {
                        description: 'User data was updated',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    message: {
                                        type: 'string'
                                    }
                                },
                            },
                        },
                    },
                    400: {
                        description: 'A field or fields in body are incorrect or missing',
                    },
                    403: {
                        description: 'Auth error',
                    },
                    404: {
                        description: 'Not found',
                    },
                    500: {
                        description: 'Something bad happened while executed the API call. Server error',
                    }
                }
            }
        },
        'user/{id}': {
            get: {
                tags: ['User CRUD operations'],
                description: 'GET operation that returns a User for the provided ID',
                operationId: 'User.get',
                parameters: [
                    {
                        name: "id", // name of the param
                        in: "path", // location of the param
                        schema: {
                            $ref: "#/components/schemas/id", // data model of the param
                        },
                        required: true, // Mandatory param
                        description: "A single User id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'User data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
        'user/{email}': {
            get: {
                tags: ['User CRUD operations'],
                description: 'GET operation that returns a User for the provided email',
                operationId: 'User.get',
                parameters: [
                    {
                        name: "email", // name of the param
                        in: "path", // location of the param
                        schema: {
                            type: 'string',
                            format: 'email',
                            description: 'The email associated to an user'
                        },
                        required: true, // Mandatory param
                        description: "A single User id", // param desc.
                    },
                ],
                response: {
                    200: {
                        description: 'User data were obtained',
                        content: {
                            // content-type
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User", // Todo model
                                },
                            },
                        },
                        400: {
                            description: 'A field or fields in body are incorrect or missing',
                        },
                        403: {
                            description: 'Auth error',
                        },
                        404: {
                            description: 'Not found',
                        },
                        500: {
                            description: 'Something bad happened while executed the API call. Server error',
                        }
                    }
                }
            }
        },
    }
}