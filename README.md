#DesktopAI

This software is a sort of framework to artificial intelligence. This software automatically installs dependencies. However it currently only allows fresh install dependency downloading, I'm yet to implement a partial dependency retriever. It downloads MySQL from my web server and configures it for use by the DesktopAI

This will offer a free Speech-to-text engine as well as a free Text-to-speech engine, rather than using APIs by 3rd party companies with quotas, this will have an offline Speech-to-text and Text-to-speech engine. Currently.

## Working Functionality as of now
| Feature             | Description                                                                                                                                                                                                                  | Date Added |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| Installation        | When the system realises it needs to install, it allows you to go through the installation process                                                                                                                           | 29/05/2022 |
| Web Interface Login | Allows you to log in to the web interface                                                                                                                                                                                    | 29/05/2022 |
| Desktop Interface   | Only loads a blank window so far, but it loads a window, and an app tray icon                                                                                                                                                | 29/05/2022 |
| MySQL Db            | The database used to power the AI, the database will play a big role in tokenizing data, and also storing and retrieving user data                                                                                           | 29/05/2022 |
| Session Manager     | Sessions are based off network IP addresses, so if you connect via mobile, and login, you'll forever be logged in. There will be a session manager on admin where you can delete these sessions and it will log the user out | 29/05/2022 |

