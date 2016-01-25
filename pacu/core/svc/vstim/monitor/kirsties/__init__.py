from pacu.core.svc.vstim.monitor.generic import GenericMonitor
from pacu.core.svc.vstim.monitor.generic import MonitorResource
from pacu.core.svc.impl.resource import Resource
from pacu.core.svc.vstim.monitor.name import Name
from pacu.core.svc.vstim.monitor.width import Width
from pacu.core.svc.vstim.monitor.pixel_x import PixelX
from pacu.core.svc.vstim.monitor.pixel_y import PixelY

class KirstiesRegularMonitor(GenericMonitor):
    package = __package__
    sui_icon = 'desktop'
    width = Width(53)
    name = Name("Kirstie's Regular Monitor")
    pixel_x = PixelX(1920)
    pixel_y = PixelY(1080)
    __call__ = MonitorResource.bind()
    description = 'Quick setup for Kirstie\'s experiment.'

class KirstiesLargeMonitor(GenericMonitor):
    package = __package__
    sui_icon = 'desktop'
    width = Width(121)
    name = Name("Kirstie's Large Monitor")
    pixel_x = PixelX(1920)
    pixel_y = PixelY(1080)
    __call__ = MonitorResource.bind()
    description = 'This monitor is large one from LS\'s.'