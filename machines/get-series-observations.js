module.exports = {
  friendlyName: 'Get series observations',
  description: 'Get the observations or data values for an economic data series.',
  extendedDescription: '',
  inputs: {
    apiKey: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The private API key for this application.',
      required: true,
      whereToGet: {
        url: 'https://research.stlouisfed.org/useraccount/register/step1',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: ''
      }
    },
    seriesId: {
      example: 'EXCSRESNS',
      description: 'The id for a series.',
      required: true
    },
    fileType: {
      example: 'json',
      description: 'A key or file extension that indicates the type of file to send (e.g. xml, json, txt, xls).'
    },
    observationStart: {
      example: '2014-01-01',
      description: 'The start of the observation period.'
    },
    observationEnd: {
      example: '2014-01-01',
      description: 'The end of the observation period.'
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Returns observations or data values for an economic data series.',
      example: [{
        realtime_start: '2015-02-15',
        realtime_end: '2015-02-15',
        date: '2015-01-01',
        value: '2593187' 
      }]
    }
  },
  fn: function(inputs, exits) {
    var util = require('util');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    Http.sendHttpRequest({
      baseUrl: 'http://api.stlouisfed.org',
      url: '/fred/series/observations',
      method: 'get',
      params: {
        api_key: inputs.apiKey,
        series_id: inputs.seriesId,
        file_type: inputs.fileType,
        observation_start: inputs.observationStart,
        observation_end: inputs.observationEnd
      }
    }).exec({
      success: function(httpResponse) {

        // Parse response body and build up result.
        var responseBody;
        try {
          responseBody = JSON.parse(httpResponse.body);
          return exits.success(responseBody.observations);
        } catch (e) {
           return exits.error('Unexpected response from FRED API:\n' + util.inspect(responseBody, false, null) + '\nParse error:\n' + util.inspect(e));
        }
      },
      // An unexpected error occurred.
      error: function(err) {
        return exits.error(err);
      }
    });
  }
}