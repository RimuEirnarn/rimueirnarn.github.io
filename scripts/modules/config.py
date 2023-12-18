from typing import NamedTuple, TypedDict

class BuildConfig(TypedDict):
    auto_reload: bool

class PluginsConfig(TypedDict):
    output: str
    watchfor: list[str]

class Config(NamedTuple):
    patterns: list[str]
    ignores: list[str]
    merges: dict[str, list[str]]
    ignore_dir: bool
    case_sensitive: bool
    dist: dict[str, str]
    watches: list[str]
    plugins: PluginsConfig
    build: BuildConfig
