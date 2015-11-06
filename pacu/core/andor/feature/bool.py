from pacu.core.andor.feature.base import BaseFeature, AbstractMeta

class BoolMeta(AbstractMeta):
    @property
    def range(self):
        return False, True

class BoolFeature(BaseFeature):
    Meta = BoolMeta
    def __get__(self, inst, type):
        return inst.handle.bool(self.feature) if inst else self
    def __set__(self, inst, val):
        inst.handle.bool(self.feature, val)