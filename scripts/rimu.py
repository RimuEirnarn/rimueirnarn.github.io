from tomllib import loads
from pathlib import Path
import time

from watchdog.observers import Observer

from modules import build
from modules.shell import shell
from modules.watcher import CreatedEvent, DeletedEvent, EventHandler, ModifiedEvent, MovedEvent
from modules.config import Config
from patch_compact import main as patch_compact
from logging import INFO, Formatter, getLogger, StreamHandler

root_log = getLogger()
shandler = StreamHandler()
shandler.setFormatter(Formatter("[%(asctime)s %(event)-8s] %(message)s", datefmt="%Y-%m-%d %H:%M:%S"))
root_log.addHandler(shandler)
root_log.setLevel(INFO)

DIST = build.ROOT_DIR / "dist"
MAPPING = {
    "DISTCSS": "./dist/static/css",
    "DISTJS": "./dist/static/js",
    "DIST": "./dist",
    "SRC": "./src",
    "SRCCSS": "./src/css",
    "SRCJS": "./src/js",
}

def return_relative(path: Path) -> str:
    pathstr = str(path)
    root = str(build.ROOT_DIR)
    if not pathstr.startswith(root):
        return pathstr
    pathstr = pathstr.replace(root, "")
    return pathstr if pathstr[0] != '/' else pathstr[1:]

def on_moved(event: MovedEvent):
    relative_src = return_relative(event.src_path)
    relative_dst = return_relative(event.dest_path)

    root_log.info("from %s to %s", relative_src, relative_dst, extra={'event': 'moved'})

def on_created(event: CreatedEvent):
    relative_src = return_relative(event.src_path)

    root_log.info("at %s", relative_src, extra={'event': 'created'})

def on_delete(event: DeletedEvent):
    relative_src = return_relative(event.src_path)

    root_log.info("at %s", relative_src, extra={'event': 'deleted'})

def on_modified(event: ModifiedEvent):
    relative_src = return_relative(event.src_path)

    root_log.info("at %s", relative_src, extra={'event': 'modified'})

class Builder:
    def __init__(self, config: Config) -> None:
        self._observers: list[Observer] = []
        self._config = config
        patterns = None if config.patterns == [] else config.patterns
        ignore_patterns = None if config.ignores == [] else config.ignores
        self._event = EventHandler(patterns=patterns, ignore_patterns=ignore_patterns,
                                   ignore_directories=config.ignore_dir,
                                   case_sensitive=config.case_sensitive,
                                   on_moved=on_moved, on_deleted=on_delete,
                                   on_created=on_created, on_modified=on_modified)

    @classmethod
    def from_file(cls, file: str | Path):
        if isinstance(file, str):
            file = Path(file)
        data = file.read_text()
        mapped = loads(data)
        return cls(Config(**mapped))

    def start(self):
        for i in self._config.watches:
            obs = Observer()
            obs.schedule(self._event, path=i, recursive=True)
            obs.start()
            self._observers.append(obs)
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            for a in self._observers:
                a.stop()

        for a in self._observers:
            a.join()

def main():
    root_log.info("Watcher initiated", extra={'event': 'build'})
    build_ = Builder.from_file(build.ROOT_DIR / "build.config.toml")
    build_.start()

if __name__ == "__main__":
    main()
