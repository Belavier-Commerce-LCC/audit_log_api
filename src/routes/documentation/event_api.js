_mainShema = {
  id: { type: 'string' },
  actor: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      group: { type: 'string' },
    }
  },
  entity: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      group: { type: 'string' },
    }
  },
  app: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      server: { type: 'string' },
      version: { type: 'string' },
      build: { type: 'string' },
    }
  },
  changes: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        'name': { type: 'string' },
        'groupId': { type: 'string' },
        'groupName': { type: 'string' },
        'oldValue': { type: 'string' },
        'newValue': { type: 'string' },
      }
    }
  },
  request: {
    type: 'object',
    properties: {
      ip: { type: 'string' },
      timestamp: { type: 'string' }
    }
  },
}

exports.addEventSchema = {
  description: 'Create a new event',
  tags: ['events'],
  summary: 'Creates new event with given values',
  params: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        description: 'Domain name'
      },
    }
  },
  body: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      actor: {
        type: 'object',
        properties: {
          id: { type: 'string' },     // UserID = 118
          name: { type: 'string' },   // Ivanov
          group: { type: 'string' },  // Users
        }
      },
      changes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            groupId: { type: 'string' },     // Unique eventid for grouping
            name: { type: 'string' },   // Update Customer Address
            groupName: { type: 'string' },  // Update Customer Address
            oldValue: { type: 'string' },     // 141207  - some original value
            newValue: { type: 'string' },     // 141205 - some changed value
            description: { type: 'string' },   	// Message with result
          }
        }
      },
      entity: {
        type: 'object',
        properties: {
          id: { type: 'string' },     // Customer Address ID
          name: { type: 'string' },   // Customer Address ZIP
          group: { type: 'string' },  // Customer Address
        }
      },
      app: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          server: { type: 'string' },
          version: { type: 'string' },
          build: { type: 'string' },
        }
      },
      request: {
        type: 'object',
        properties: {
          ip: { type: 'string' }, //IP from request
          timestamp: { type: 'string' } //Current timestamp on api server
        }
      },
    }
  },
  /*response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        result: { type: 'string' },
      }
    }
  }*/
}

exports.getEventSchema = {
  description: 'Get single event',
  tags: ['events'],
  summary: 'Get single event',
  params: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        description: 'Domain name'
      },
      id: {
        type: 'string',
        description: 'event id'
      }
    }
  },
 /* response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: _mainShema
    }
  } */
}

exports.getEventsSchema = {
  description: 'Get all events',
  tags: ['events'],
  summary: 'Get all events',
  params: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        description: 'Domain name'
      }
    }
  },
  querystring: {
    limit: { type: 'integer' },
    offset: { type: 'integer' },
    sort: { type: 'string' },
    order: { type: 'string' },
    filter: { type: 'string' },
    dateFrom: { type: 'string' },
    dateTo: { type: 'string' },
  },
  /*response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        took: {type: 'number'},
        timed_out: {type: 'boolean'},
        _shards: {
          type: 'object',
          properties: {
            total: {type: 'number'},
            successful: {type: 'number'},
            skipped: {type: 'number'},
            failed: {type: 'number'},
          }
        },
        hits: {
          type: 'object',
          properties: {
            total: {
              type: 'object',
              properties: {
                value: {type: 'number'},
                relation: {type: 'string'},
              }
            },
            max_score: {type: 'number'},
            hits: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _index: {type: 'string'},
                  _type: {type: 'string'},
                  _id: {type: 'string'},
                  _score: {type: 'number'},
                  _source: {
                    type: 'object',
                    properties: {
                      actor: {
                        type: 'object',
                        properties: {
                          id: {type: 'string'},     // UserID = 118
                          name: {type: 'string'},   // Ivanov
                          group: {type: 'string'},  // Users
                        }
                      },
                      event: {
                        type: 'object',
                        properties: {
                          id: {type: 'string'},     // Unique eventid for grouping
                          name: {type: 'string'},   // Update Customer Address
                          group: {type: 'string'},  // Update Customer Address
                          action: {type: 'string'},       // update
                          oldValue: {type: 'string'},     // 141207  - some original value
                          newValue: {type: 'string'},     // 141205 - some changed value
                          ip: {type: 'string'},    // Source IP address
                          description: {type: 'string'},   	// Message with result
                          created: {type: 'string'},      // Date of event
                        }
                      },
                      entity: {
                        type: 'object',
                        properties: {
                          id: {type: 'string'},     // Customer Address ID
                          name: {type: 'string'},   // Customer Address ZIP
                          group: {type: 'string'},  // Customer Address
                        }
                      },
                      related: {
                        type: 'object',
                        properties: {
                          id: {type: 'string'},    // Customer ID
                          name: {type: 'string'},  // Customer
                          group: {type: 'string'}, // Customer
                        }
                      },
                      app: {
                        type: 'object',
                        properties: {
                          name: {type: 'string'},
                          server: {type: 'string'},
                          version: {type: 'string'},
                          build: {type: 'string'},
                        }
                      },
                      request: {
                        type: 'object',
                        properties: {
                          ip: {type: 'string'}, //IP from request
                          timestamp: {type: 'string'} //Current timestamp on api server
                        }
                      },
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }*/
}

exports.getFieldValuesSchema = {
  description: 'Get array of unique Field Values',
  tags: ['events'],
  summary: 'Get array of unique Field Values',
  params: {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        description: 'Domain name'
      },
      field: {
        type: 'string',
        description: 'Field name, example: related.name'
      }
    }
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
}

exports.rootPathSchema = {
  hide: true
}

