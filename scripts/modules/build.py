from os.path import splitext
from pathlib import Path
from re import compile as re_compile
import shutil
from os import getcwd

from .watcher import Events

white = re_compile(r"(?m)^\s+")
ROOT_DIR = Path(getcwd())

def _process_css(src: str):
    data = white.sub("", src.strip().rstrip()).replace('\n',"")
    return data

def process_css(src: Path, dst: Path):
    data = _process_css(src.read_text())
    dst.write_text(data)

def process_css_merge(*src: Path, dst: Path):
    data = _process_css(''.join((a.read_text() for a in src)))
    dst.write_text(data)

def copy(src: Path, dst: Path):
    shutil.copy(src, dst)

def generic_event(event: Events):
    extract_src: str = event.src_path
    dest: str = event.dest_path if hasattr(event, 'dest_path') else "" # type: ignore
    etype = event.event_type
    ftype = "dir" if event.is_directory else "file"
    src_ext = splitext(extract_src)[1]
    return (extract_src, src_ext), dest, etype, ftype
