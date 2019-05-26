import React, { Component } from 'react';
import ProcessLinkedState from 'state/ProcessLinkedState';
import hocConnect from 'state/hocConnect';

class Processes extends Component {
  render() {
    let { processes } = this.props;
    processes = processes || [];

    // TODO: Make table sortable
    return (
      <table style={{width: '100%', textAlign: 'left'}}>
        <thead>
          <tr>
            <td>
              PID
            </td>
            <td>
              Class
            </td>
            <td>
              ServiceURI
            </td>
            <td>
              Start Date
            </td>
            <td>
              Name
            </td>
            <td>
              f(x)
            </td>
          </tr>
        </thead>
        <tbody>
          {
            processes.map((process, idx) => {
              const startDate = process.getStartDate().toString();
              const className = process.getClassName();
              const serviceURI = process.getServiceURI();
              const pid = process.getPID();
              const name = process.getName();
              
              return (
                <tr key={`${pid}-${idx}`}>
                  <td>
                    { pid }
                  </td>
                  <td>
                    { className }
                  </td>
                  <td style={{maxWidth: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
                    { serviceURI }
                  </td>
                  <td style={{maxWidth: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>
                    { startDate }
                  </td>
                  <td>
                    { name }
                  </td>
                  <td>
                    <button onClick={ evt => process.kill() }>Close</button>
                    <button>Detail</button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }
}

export default hocConnect(Processes, ProcessLinkedState);