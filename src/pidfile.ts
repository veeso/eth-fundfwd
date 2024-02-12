import { writeFile } from 'fs';

const writePidfile = (pidfile: string): void => {
  const pid = process.pid.toString();
  writeFile(pidfile, pid, (err) => {
    if (err) {
      console.error('failed to write pidfile:', err);
    }
  });
};

export default writePidfile;
