from datetime import datetime

import numpy as np
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import Unicode
from sqlalchemy import DateTime
from sqlalchemy.types import PickleType
from sqlalchemy.types import UnicodeText

from . import Base

from pacu.profile import manager
glab = manager.get('db').section('glab')

class ExperimentV1(Base):
    @classmethod
    def query(cls):
        return glab().query(cls)
    @classmethod
    def find_keyword(cls, keyword):
        return glab().query(
            ExperimentV1.id, ExperimentV1.created_at, ExperimentV1.keyword
        ).filter(ExperimentV1.keyword.contains(keyword)).all()

    __tablename__ = 'experiment_v1'
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    clsname = Column(Unicode(256))
    pkgname = Column(Unicode(256))
    keyword = Column(Unicode(256))
    duration = Column(Float)
    message = Column(UnicodeText)
    on_time = Column(PickleType, default={})
    off_time = Column(PickleType, default={})
    sequence = Column(PickleType, default={})
    ran = Column(PickleType, default={})
    order = Column(PickleType, default={})
    payload = Column(PickleType, default={})
    trial_list = Column(PickleType, default={})

    projection_clsname = Column(Unicode(256))
    projection_pkgname = Column(Unicode(256))
    projection_kwargs = Column(PickleType, default={})
    clock_clsname = Column(Unicode(256))
    clock_pkgname = Column(Unicode(256))
    clock_kwargs = Column(PickleType, default={})
    stimulus_clsname = Column(Unicode(256))
    stimulus_pkgname = Column(Unicode(256))
    stimulus_kwargs = Column(PickleType, default={})
    window_clsname = Column(Unicode(256))
    window_pkgname = Column(Unicode(256))
    window_kwargs = Column(PickleType, default={})
    handler_clsname = Column(Unicode(256))
    handler_pkgname = Column(Unicode(256))
    handler_kwargs = Column(PickleType, default={})
    monitor_clsname = Column(Unicode(256))
    monitor_pkgname = Column(Unicode(256))
    monitor_kwargs = Column(PickleType, default={})

    def __iter__(self):
        return iter(self.ordered_trials)
    @property
    def ordered_trials(self):
        seq = np.array(self.sequence)
        trials = self.trial_list[seq].T.flatten()
        default_contrast = self.stimulus_kwargs.get('contrast', 1)
        for index, trial in enumerate(trials):
            if 'contrast' not in trial:
                trial['contrast'] = default_contrast
                # print 'trial #', index, 'default contrast was assigned', default_contrast
        on_time, off_time , sequence, ran, order = [
            np.concatenate([
                data[indice]
                for data, indice
                in zip(np.array(getattr(self, attr)).T, seq.T)
            ]) for attr in 'on_time off_time sequence ran order'.split()]
        return [
            dict(on_time=float(on_time), off_time=float(off_time),
                sequence=int(sequence), ran=int(ran), order=int(order), **condition)
            for on_time, off_time, sequence, ran, order, condition
            in zip(on_time, off_time, sequence, ran, order, trials)
        ]
