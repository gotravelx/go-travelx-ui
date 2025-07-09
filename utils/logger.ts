import log from "loglevel"

if (process.env.NODE_ENV === "development") {
  log.setLevel("debug")
} else {
  log.setLevel("warn")
}

interface Logger {
  info: (message: string) => void
  warn: (message: string) => void
  error: (message: string) => void
  debug: (message: string) => void
}

const logger: Logger = {
  info: (message: string) => log.info(`[INFO]: ${message}`),
  warn: (message: string) => log.warn(`[WARN]: ${message}`),
  error: (message: string) => log.error(`[ERROR]: ${message}`),
  debug: (message: string) => log.debug(`[DEBUG]: ${message}`),
}

export default logger
