from pacu.ext.labjack.u3 import U3Proxy
# from pacu.ext.labjack import u3
# t0 = u3.u3.Timer0(UpdateReset=True)
# t1 = u3.u3.Timer1(UpdateReset=True)
# c0 = u3.u3.Counter0(Reset=True)
# c1 = u3.u3.Counter1(Reset=True)
from pacu.ext.psychopy import logging
from pacu.core.svc.impl.exc import TimeoutException
from pacu.core.svc.impl.exc import UserAbortException
from pacu.core.svc.impl.exc import ComponentNotFoundError
from pacu.core.svc.vstim.clock.timeout import Timeout
from pacu.core.svc.vstim.clock.base import ClockResource
from pacu.core.svc.vstim.clock.base import ClockBase
from psychopy import event
from psychopy.core import CountdownTimer

class LabJackClockResource(ClockResource):
    def __enter__(self):
        try:
            self.proxy = U3Proxy()
            u3 = self.proxy.__enter__()
        except Exception as e:
            raise ComponentNotFoundError(
                'Could not initialize LabJack Device: ' + str(e))
        self.started_at = u3.get_time()
        self.instance = u3
        return self
    def getTime(self):
        return self.instance.get_time()
    def __exit__(self, type, value, traceback):
        self.finished_at = self.getTime() - self.started_at
        self.proxy.__exit__(type, value, traceback)
    def synchronize(self, stimulus):
        logging.msg('Await a signal from Labjack in {} sec...'.format(
            self.component.timeout))
        logging.flush()
        for i in range(self.component.timeout, 0, -1):
            timer = CountdownTimer(1)
            msg = 'Await a signal from LabJack in {} sec...'.format(i)
            stimulus.flip_text(msg)
            while timer.getTime() > 0:
                if event.getKeys('escape'):
                    raise UserAbortException()
                if self.instance.get_counter():
                    logging.msg('counter increased')
                    logging.flush()
                    self.instance.reset_timer()
                    return
        else: # timeout...
            raise TimeoutException('Could not catch any signal from LabJack.')
class LabJackClock(ClockBase):
    sui_icon = 'wait'
    package = __package__
    wait_time = 0
    timeout = Timeout(15)
    __call__ = LabJackClockResource.bind()
    description = 'This LabJack clock is supposed to work with ScanBox gear. This clock does not control ScanBox recording. So it is user\'s responsibility to stop the recording session.'
