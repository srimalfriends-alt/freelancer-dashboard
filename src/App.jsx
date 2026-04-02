import { Button, Form, Table } from 'react-bootstrap';
import './App.css'
import { useEffect, useMemo, useState } from 'react';
import api from './api/axios';

function App() {

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const platforms = ['YouTube - PSR Vlog', 'YouTube PSR Academy', 'LinkedIn', 'Facebook', 'Instagram'];

  const [record, setRecord] = useState({
    platform: 'YouTube - PSR Vlog',
    income: 0,
    deductions: 0,
    month: 'January',
  });
  
  const [history, setHistory] = useState([]);

  const getTableData = async () => {
    return await api.get('/income-records')
      .then(response => {
        console.log('response', response);
        setHistory(response.data.data);
      })
      .catch(error => console.error('Axios Error: ', error));
  }

  useEffect(() => {
    getTableData();
  }, []);

  const getRecordTotal = (a, b) => a - b;

  const submit = () => {
    const payload = {
      ...record, 
      recordTotal: getRecordTotal(record.income, record.deductions)
    };

    api.post('/income-records', payload)
      .then(response => {
        getTableData();
        console.log('response', response);
        setRecord({
          platform: 'YouTube - PSR Vlog',
          income: 0,
          deductions: 0,
          month: 'January',
        });
      })
      .catch(error => console.error('Axios Error: ', error));
  }

  console.log('history', history);

  return (
    <>
      <section id="center">
        <div className='w-100 p-3'>
          <h2>Income Inputs</h2>
          <Form>
            <Form.Group className="mb-3 d-flex" controlId="formBasicEmail">
              <Form.Label className='me-2'>Select the month</Form.Label>
              <Form.Select className='w-25 mb-3' aria-label="Default select example" value={record.month} onChange={e => setRecord({...record, month: e.target.value})}>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 d-flex" controlId="formBasicEmail">
              <Form.Label className='me-2'>Select the Platform</Form.Label>
              <Form.Select className='w-25 mb-3' aria-label="Default select example" value={record.platform} onChange={e => setRecord({...record, platform: e.target.value})}>
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 d-flex" controlId="formBasicEmail">
              <Form.Label className='me-2'>Record Data</Form.Label>
              <Form.Control className='me-2' type="number" placeholder="Enter Income" value={record.income} onChange={e => setRecord({...record, income: e.target.value})} />
              <Form.Control className='me-2' type="number" placeholder="Enter Deductions" value={record.deductions} onChange={e => setRecord({...record, deductions: e.target.value})} />
              <Form.Control type="number" disabled value={getRecordTotal(record.income, record.deductions)} />
            </Form.Group>

            <Button variant="primary" onClick={() => submit()}>
              Save
            </Button>
          </Form>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div className='w-100 p-3'>
          <h2>Past Income History</h2>
          <Table>
            <thead>
              <tr>
                <th>Record ID</th>
                <th>Month</th>
                <th>Platform</th>
                <th>Income</th>
                <th>Deductions</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {
                history?.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.month}</td>
                    <td>{r.platform}</td>
                    <td>{r.income}</td>
                    <td>{r.deductions}</td>
                    <td>{r.record_total}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
