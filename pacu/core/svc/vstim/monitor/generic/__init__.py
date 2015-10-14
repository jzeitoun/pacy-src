from pacu.core.svc.impl.resource import Resource
from pacu.core.svc.impl.component import Component
from pacu.core.svc.vstim.monitor.gamma import Gamma
from pacu.core.svc.vstim.monitor.unit import Unit
from pacu.core.svc.vstim.monitor.dist import Dist
from pacu.core.svc.vstim.monitor.name import Name
from pacu.core.svc.vstim.monitor.width import Width
from pacu.core.svc.vstim.monitor.pixel_x import PixelX
from pacu.core.svc.vstim.monitor.pixel_y import PixelY

class MonitorResource(Resource):
    def __enter__(self):
        from psychopy.monitors import Monitor
        comp = self.component
        monitor = Monitor(comp.name, width=comp.width, distance=comp.dist)
        monitor.setSizePix((comp.pixel_x, comp.pixel_y))
        self.instance = monitor
        return self

class GenericMonitor(Component):
    package = __package__
    sui_icon = 'desktop'
    gamma = Gamma(1.0)
    width = Width(40)
    unit = Unit('deg')
    dist = Dist(10)
    name = Name('GenericMonitor')
    pixel_x = PixelX(1440)
    pixel_y = PixelY(960)
    __call__ = MonitorResource.bind()
