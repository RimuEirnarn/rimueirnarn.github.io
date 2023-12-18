from subprocess import CompletedProcess

class ProcessError(Exception):
    def __init__(self, message: str, data: CompletedProcess) -> None:
        super().__init__(message)
        self._data = data

    @property
    def data(self):
        """Result of the process"""
        return self._data
