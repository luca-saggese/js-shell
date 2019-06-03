import React, { Component } from 'react';
import ProcessLinkedState from 'state/ProcessLinkedState';
import CPUTimeLinkedState from 'state/CPUTimeLinkedState';
import hocConnect from 'state/hocConnect';
import moment from 'moment';

const CPUUsagePercent = (props = {}) => {
  return (
    <span>{props.percent} %</span>
  );
}

const MainCPUUsagePercent = hocConnect(CPUUsagePercent, CPUTimeLinkedState, (updatedState) => {
  const { cpusLevels } = updatedState;

  if (cpusLevels && cpusLevels[0]) {
    return {
      percent: cpusLevels[0]
    }
  }
});

class Processes extends Component {
  render() {
    let { processes } = this.props;
    processes = processes || [];

    // TODO: Make table sortable
    return (
      <div>
        <div style={{ overflow: 'auto' }}>
          <div style={{ display: 'inline-block' }}>
            <input type="checkbox" checked />Include Client Processes
          </div>

          &nbsp;&nbsp;&nbsp;&nbsp;

          <div style={{ display: 'inline-block' }}>
            <input type="checkbox" />Include Server Processes
          </div>
        </div>
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <td>
                PID
              </td>
              <td>
                PPID
              </td>
              <td>
                Name
              </td>
              <td>
                Base
              </td>
              <td>
                CPU
              </td>
              <td>
                Thread Type
              </td>
              <td>
                Service URI
              </td>
              <td>
                Start Time
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
                const base = process.getBase();
                const threadType = process.getThreadType();
                const serviceURI = process.getServiceURI();
                const pid = process.getPID();
                const parentPID = process.getParentPID();

                return (
                  <tr key={`${pid}-${idx}`}>
                    <td>
                      {pid}
                    </td>
                    <td>
                      {parentPID}
                    </td>
                    <td>
                      {className}
                    </td>
                    <td>
                      {base}
                    </td>
                    <td>
                      <MainCPUUsagePercent />
                    </td>
                    <td>
                      {threadType}
                    </td>
                    <td style={{ maxWidth: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {serviceURI}
                    </td>
                    <td style={{ maxWidth: 200, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {moment(startDate).format('YYYY-MM-DD hh:mm:ss A')}
                    </td>
                    <td>
                      <button onClick={evt => process.kill()}>Close</button>
                      <button>Detail</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default hocConnect(Processes, ProcessLinkedState);