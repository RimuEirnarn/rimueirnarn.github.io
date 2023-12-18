"""Shell utility"""
from os import environ
from shlex import split
from subprocess import PIPE, CompletedProcess, run, Popen
from pathlib import Path
from shutil import which
from typing import Any, Callable, Type, NamedTuple, overload
from contextvars import ContextVar
from random import randint
from types import ModuleType
from .error import ProcessError

path = Path("~/.cache/simulation-shell-commands.cache").expanduser()
PATH = environ['PATH'].split(':')
CACHED_COMMANDS = {}
SPECIAL_FUNCTIONS = {}
KwdArgs = dict[str, Any]
ContextKwdArgs = ContextVar("ContextKwdArgs", default=None)

class ContextData(NamedTuple):
    name: str
    data: dict[str, Any]
    context: 'Context'
    sensitive: bool

class Context:
    """Context

    This class is a context-manager that manipulate default command behavior, however, it also
    overwrite your in-context changes such as defer"""
    __slots__ = ("_data", "_context", "_token", "_name",
                 "_exit", "_deferred", "_sense", "_error")
    def __init__(self, name=None, sensitive=False, **kwargs) -> None:
        self._data = {}
        self._token = None
        self._name = f'run-{randint(0, 999999)}' if name is None else name
        self._context = ContextData(self._name, kwargs, self, sensitive)
        self._sense = sensitive
        self._error = False

    @property
    def was_error(self):
        return self._error

    def __call__(self, name: str, args: str):
        with self:
            getattr(self, name)(args)

    def __enter__(self):
        self._token = ContextKwdArgs.set(self._context) # type: ignore

    def __exit__(self, exc_type: Type[BaseException], *_):
        if exc_type:
            self._error = True
        if self._token is not None:
            ContextKwdArgs.reset(self._token)
        return True

class Command:
    """Command class"""
    def __init__(self, name, path):
        self._name = name
        self._path = path
        self._exec = path

    @property
    def name(self):
        """Name of command"""
        return self._name

    @property
    def path(self):
        """Path of command"""
        return self._path

    @overload
    def __call__(self, arg: str = "", background=True, **kwargs) -> Popen:
        ...

    @overload
    def __call__(self, arg: str = "", background=False, **kwargs) -> Callable[[], CompletedProcess]:
        ...

    @overload
    def __call__(self, arg: str = "", background=False, **kwargs) -> CompletedProcess:
        ...

    def __call__(self, arg: str = "", background=False, **kwargs):
        """Call to current command.

        dackground is to spawn regular Popen, you manage the returned process
        defer only create a anonymous function to call pre-shaped commands.
        kwargs is subprocess.Popen arguments (overwriten by Context)"""
        split_args = list(split(arg))
        x = []
        if 'executable' in self._path:
            del self._path['executable']
        for i in split_args:
            if (i.startswith('"') or i.startswith("'")) and (i.endswith('"') or i.endswith("'")):
                x.append(i[1:-1])
                continue
            x.append(i)
        if background:
            kwargs['input'] = PIPE
            kwargs['output'] = PIPE
            kwargs['stderr'] = PIPE
        args = (self._name, *tuple(x))
        context: ContextData = ContextKwdArgs.get() or ContextData('main', {}, False, None, False) # type: ignore
        if context.data:
            kwargs.update(**context.data) # type: ignore

        if background:
            if context.sensitive:
                raise ValueError("sensitive is incompatible with background")
            return Popen(args, **kwargs, executable=self._exec)

        if context.sensitive:
            result = run(args, **kwargs, executable=self._exec)
            if result.returncode != 0:
                raise ProcessError(f"Process returned {result.returncode}", result)
        return run(args, **kwargs, executable=self._exec)

    def __repr__(self) -> str:
        return f"<Command({self._name}) -> {id(self)}>"

def make_cmd(path):
    """Create new command from path"""
    if not path:
        raise ValueError("Must not empty string")
    name = path.split('/')[-1]
    return Command(name, path)

def fetch(name):
    """Fetch and return command from PATH"""
    if not name in CACHED_COMMANDS:
        path = which(name)
        if not path:
            raise LookupError(f"{name} is undefined")
        CACHED_COMMANDS[name] = Command(name, path)
    return CACHED_COMMANDS[name]

SPECIAL_FUNCTIONS['make_cmd'] = make_cmd
SPECIAL_FUNCTIONS['fetch'] = fetch


def shell__getattr__(name: str):
    if name in SPECIAL_FUNCTIONS:
        return SPECIAL_FUNCTIONS[name]
    if name in CACHED_COMMANDS:
        return CACHED_COMMANDS[name]
    path = which(name)
    if not path:
        raise AttributeError(f"{name} is undefined")
    command = Command(name, path)
    CACHED_COMMANDS[name] = command
    return command

shell = ModuleType('shells')
shell.__getattr__ = shell__getattr__
