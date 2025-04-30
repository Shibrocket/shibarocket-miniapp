import os
import time

# Force timezone to UTC properly
os.environ['TZ'] = 'UTC'
time.tzset()

import pytz
import apscheduler.util
apscheduler.util.astimezone = lambda _: pytz.UTC

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes, Defaults

# Your Bot Token
BOT_TOKEN = "7885975404:AAH5BW5gpGv0Rh0AUaB2djQfNGQi8hvbUnc"

# /start command
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello! Bot is now working.")

# /help command
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Available commands:\n/start - Start the bot\n/help - Show this message")

def main():
    app = ApplicationBuilder()\
        .token(BOT_TOKEN)\
        .defaults(Defaults(tzinfo=pytz.UTC))\
        .build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))

    print("Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
