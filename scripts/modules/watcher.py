"""Watcher"""

from typing import Callable
from watchdog.observers import Observer
from watchdog.events import (FileClosedEvent, PatternMatchingEventHandler, DirMovedEvent, FileMovedEvent,
                             DirModifiedEvent, FileModifiedEvent, FileCreatedEvent, DirCreatedEvent,
                             FileDeletedEvent, DirDeletedEvent)

MovedEvent = DirMovedEvent | FileMovedEvent
ModifiedEvent = DirModifiedEvent | FileModifiedEvent
CreatedEvent = DirCreatedEvent | FileCreatedEvent
DeletedEvent = DirDeletedEvent | FileDeletedEvent
ClosedEvent = FileClosedEvent

Events = MovedEvent | ModifiedEvent | CreatedEvent | DeletedEvent | ClosedEvent

class EventHandler(PatternMatchingEventHandler):
    def __init__(self,
                 patterns: list[str] | None = None,
                 ignore_patterns: list[str] | None = None,
                 ignore_directories: bool = False,
                 case_sensitive: bool = False,
                 on_moved: Callable[[MovedEvent], None] | None = None,
                 on_modified: Callable[[ModifiedEvent], None] | None = None,
                 on_created: Callable[[CreatedEvent], None] | None = None,
                 on_closed: Callable[[ClosedEvent], None] | None = None,
                 on_deleted: Callable[[DeletedEvent], None] | None = None):
        super().__init__(patterns, ignore_patterns, ignore_directories, case_sensitive)
        self._on_moved = on_moved
        self._on_modified = on_modified
        self._on_closed = on_closed
        self._on_created = on_created
        self._on_deleted = on_deleted

    def on_moved(self, event: MovedEvent):
        if self._on_moved:
            self._on_moved(event)
        return super().on_moved(event)

    def on_deleted(self, event: DeletedEvent):
        if self._on_deleted:
            self._on_deleted(event)
        return super().on_deleted(event)

    def on_created(self, event: CreatedEvent):
        if self._on_created:
            self._on_created(event)
        return super().on_created(event)

    def on_closed(self, event: ClosedEvent):
        if self._on_closed:
            self._on_closed(event)
        return super().on_closed(event)

    def on_modified(self, event: ModifiedEvent):
        if self._on_modified:
            self._on_modified(event)
        return super().on_modified(event)

