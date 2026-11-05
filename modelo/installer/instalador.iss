; Inno Setup 6 — mesmo formato do installer\instalador.iss do Plus: a pasta do PyInstaller vira
; um instalador .exe em português, com o ícone da UP.
; Troque os #define abaixo. O AppId identifica o programa no Windows: gere um GUID novo
; (Inno Setup > Tools > Generate GUID) e NUNCA mude depois, senão vira "outro programa".

#define MyAppName "Meu Sistema"
#define MyAppPublisher "UP Contábil"
#define MyAppExeName "MeuSistema.exe"
#ifndef MyAppVersion
  #define MyAppVersion "1.0.0"
#endif

[Setup]
AppId={{00000000-0000-0000-0000-000000000000}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppPublisher}\{#MyAppName}
DisableProgramGroupPage=yes
PrivilegesRequired=admin
OutputDir=Output
OutputBaseFilename=MeuSistema_Setup
SetupIconFile=..\assets\logo.ico
UninstallDisplayIcon={app}\{#MyAppExeName}
WizardStyle=modern
Compression=lzma2/normal
SolidCompression=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
CloseApplications=force

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

[Tasks]
Name: "desktopicon"; Description: "Criar um atalho na Área de Trabalho"; GroupDescription: "Atalhos:"; Flags: checkedonce

[Files]
Source: "..\dist\MeuSistema\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "Abrir o {#MyAppName} agora"; Flags: nowait postinstall skipifsilent runasoriginaluser

[InstallDelete]
; versão nova substitui a pasta interna inteira (nada de biblioteca velha sobrando)
Type: filesandordirs; Name: "{app}\_internal"
