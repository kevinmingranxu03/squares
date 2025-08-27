import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { resetSavesForTesting, addSaveForTesting, dummy, getNames, save, load } from './routes';


describe('routes', function () {
  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function () {
    // You can copy this test structure to start your own tests, these comments
    // are included as a reminder of how testing routes works:

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
      // query: is how we add query params. body: {} can be used to test a POST request
      { method: 'GET', url: '/api/dummy', query: { name: 'Kevin' } });
    const res1 = httpMocks.createResponse();
    // call our function to execute the request and fill in the response
    dummy(req1, res1);
    // check that the request was successful
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepStrictEqual(res1._getData(), { greeting: 'Hi, Kevin' });
  });

  it('getName', function () {
    // Branch statement: executes 1st return
    addSaveForTesting("file1", 1);
    addSaveForTesting("file2", 2);
    addSaveForTesting("file3", 3);

    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list'}
    );
    const res1 = httpMocks.createResponse();
    getNames(req1, res1);

    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData(), {files: ["file1", "file2", "file3"]});
    resetSavesForTesting();
    // Branch coverage: covered above, ["file1", "file2", "file3"] executes 1st branch
    // Looping/recursive coverage: getName function has no loops or recursion

    // Branch statement: executes 1st return
    addSaveForTesting("f1", 11);
    addSaveForTesting("f2", 22);
    addSaveForTesting("f2", 32);
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list'}
    );
    const res2 = httpMocks.createResponse();
    getNames(req2, res2);

    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData(), {files: ["f1", "f2"]});
    resetSavesForTesting();
    // Branch coverage: covered above, ["f1", "f2"] executes 1st branch
    // Looping/recursive coverage: getName function has no loops or recursion

    // Branch statement: executes 1st returns
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/list'}
    );
    const res3 = httpMocks.createResponse();
    getNames(req3, res3);

    assert.deepStrictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getJSONData(), {files: []});
    resetSavesForTesting();
    // Branch coverage: covered above, [] executes 1st branch
    // Looping/recursive coverage: getName function has no loops or recursion
  });

  it('save', function () {
    // Statement coverage: executes 1st branch
    // Branch coverage: body: {name: undefined} executes 1st branch
    const req0 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: undefined}
    );
    const res0 = httpMocks.createResponse();
    save(req0, res0);
    assert.deepStrictEqual(res0._getStatusCode(), 400);
    resetSavesForTesting();

    // Statement coverage: executes 2nd branch
    // Branch coverage: body: {name: 'file1', contents: 6} executes 2nd branch
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'file1', cotents: 6}}
    );
    const res1 = httpMocks.createResponse();
    save(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData(), {status: true});
    // Use getName functions to double check whether it's fully saved
    const req2 = httpMocks.createRequest({method: 'GET', url: '/api/list'});
    const res2 = httpMocks.createResponse();
    getNames(req2, res2);
    assert.deepStrictEqual(res2._getJSONData(), {files: ['file1']});
    resetSavesForTesting();

    // Statement coverage: executes 2nd branch
    // Branch coverage: body: {name: 'file1', contents: 6} executes 2nd branch,
    // body: {name: 'file2', contents: 16} executes 2nd branch
    const req3_1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'file1', cotents: 6}}
    );
    const res3_1 = httpMocks.createResponse();
    const req3_2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/save', body: {name: 'file2', cotents: 16}}
    );
    const res3_2 = httpMocks.createResponse();
    save(req3_1, res3_1);
    save(req3_2, res3_2);
    assert.deepStrictEqual(res3_1._getStatusCode(), 200);
    assert.deepStrictEqual(res3_1._getJSONData(), {status: true});
    assert.deepStrictEqual(res3_2._getStatusCode(), 200);
    assert.deepStrictEqual(res3_2._getJSONData(), {status: true});
  
    const req4 = httpMocks.createRequest({method: 'GET', url: '/api/list'});
    const res4 = httpMocks.createResponse();
    getNames(req4, res4);
    assert.deepStrictEqual(res4._getJSONData(), {files: ['file1', 'file2']});
    resetSavesForTesting();
    // Looping/recursive coverage: getName function has no loops or recursion
  });

  it('load', function () {
    // Statement coverage: executes 1st branch
    // Branch coverage: query: {name: undefined} executes 1st branch
    const req0 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: undefined}}
    );
    const res0 = httpMocks.createResponse();
    load(req0, res0);
    assert.deepStrictEqual(res0._getStatusCode(), 400);
    resetSavesForTesting();

    // Statement coverage: executes 2nd branch
    // Branch coverage: query: {name: 'file0'} executes 2nd branch
    addSaveForTesting('file1', {x: 1});
    const req1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: 'file0'}}
    );
    const res1 = httpMocks.createResponse();
    load(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData(), {name: 'file0', contents: null});

    // Statement coverage: executes 3rd branch
    // Branch coverage: query: {name: 'file1'} executes 3rd branch,
    // query: {name: 'file2'} executes 3rd branch
    addSaveForTesting('file2', {x: 2});
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: 'file1'}}
    );
    const res2 = httpMocks.createResponse();
    load(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData(), {name: 'file1', contents: {x: 1}});

    // Statement coverage: executes 3rd branch
    // Branch coverage: query: {name: 'file2'} executes 3rd branch
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/load', query: {name: 'file2'}}
    );
    const res3 = httpMocks.createResponse();
    load(req3, res3);
    assert.deepStrictEqual(res3._getJSONData(), {name: 'file2', contents: {x: 2}});
    resetSavesForTesting();
    // Looping/recursive coverage: getName function has no loops or recursion
  });
});
