/* eslint-disable max-len */
const language = {
  general: {
    yes: {
      en: 'Yes',
      de: 'Ja',
    },
    no: {
      en: 'No',
      de: 'Nein',
    },
    general: {
      en: 'General',
      de: 'General',
    },
    process_location: {
      en: 'Process type & location',
      de: 'Process type & location',
    },
    process_location_helper: {
      en: 'What kind of job are you trying to run',
      de: 'What kind of job are you trying to run',
    },
    job_name: {
      en: 'Job name',
      de: 'Job name',
    },
    job_name_helper: {
      en: 'What is the name you want to refer to for this Autodeck job',
      de: 'What is the name you want to refer to for this Autodeck job',
    },
    website_screenshot: {
      en: 'Website screenshot',
      de: 'Website screenshot',
    },
    website_screenshot_subtext: {
      en: 'Choose between uploading your website screenshot or inserting an existing URL.',
      de: 'Choose between uploading your website screenshot or inserting an existing URL.',
    },
    website_screenshot_helper: {
      en: 'Tell whether you want Autodeck to take a screenshot for you',
      de: 'Tell whether you want Autodeck to take a screenshot for you',
    },
    logo_manipulation: {
      en: 'Logo manipulation',
      de: 'Logo manipulation',
    },
    logo_manipulation_helper: {
      en:
        'Describe what logo-manipulating tasks should be executed by Autodeck before generation personalized content',
      de:
        'Describe what logo-manipulating tasks should be executed by Autodeck before generation personalized content',
    },
    created_at: {
      en: 'Created at',
      de: 'Hergestellt in',
    },
    updated_at: {
      en: 'Updated at',
      de: 'Aktualisiert am',
    },
    add_choice: {
      en: 'Add choice',
      de: 'Wahl hinzufügen',
    },
    no_choices: {
      en: 'You have no choices yet',
      de: 'Sie haben noch keine Auswahlmöglichkeiten',
    },
    edit_dialogue: {
      en: 'Edit dialogue',
      de: 'Dialog bearbeiten',
    },
    all: {
      en: 'All',
      de: 'Alle',
    },
    link: {
      en: 'Link',
      de: 'Verknüpfung',
    },
    form: {
      en: 'Form',
      de: 'Bilden',
    },
    choice: {
      en: 'Choice',
      de: 'Wahl',
    },
    set_your_choice: {
      en: 'Set your choice',
      de: 'Stellen Sie Ihre Wahl ein',
    },
    delivery_recipient: {
      en: 'Related delivery',
      de: 'Verwandte Lieferung.',
    },
    origin_url: {
      en: 'Originating url',
      de: 'Ursprungs-URL',
    },
    duration: {
      en: 'Duration',
      de: 'Dauer',
    },
    seconds: {
      en: 'Seconds',
      de: 'Sekunden',
    },
    device: {
      en: 'Device',
      de: 'Gerät',
    },
    events: {
      en: 'Events',
      de: 'Veranstaltungen',
    },
    scheduled_event: {
      en: 'Delivery was scheduled',
      de: 'Die Lieferung war geplant',
    },
    deployed_event: {
      en: 'Delivery was sent',
      de: 'Die Lieferung wurde gesendet',
    },
    opened_event: {
      en: 'Delivery was opened',
      de: 'Lieferung wurde eröffnet',
    },
    finished_event: {
      en: "Delivery's dialogue was finished",
      de: 'Der Dialog der Lieferung wurde abgeschlossen',
    },
    details: {
      en: 'Details',
      de: 'Detail',
    },
    upload_deliveries: {
      en: 'Upload deliveries',
      de: 'Lieferungen hochladen.',
    },
    upload_deliveries_helper: {
      en:
        'Upload a CSV file with details about your recipients. \n - The appropriate format is to use ";" as delimiter \n - Use firstName;lastName;email;phone as your columns \n - Prefix the phone numbers with their country code: for example +49 30901820',
      de:
        'Laden Sie eine CSV-Datei mit Details zu Ihren Empfängern hoch. \n - Das entsprechende Format ist ";" als Trennzeichen \n - Verwenden Sie firstName;lastName;email;phone als Spalten. \n - Stellen Sie den Telefonnummern ihre Landesvorwahl voran, z. B. +49 30901820',
    },
    scheduled_at: {
      en: 'Schedule for when to send',
      de: 'Zeitplan',
    },
    scheduled_at_helper: {
      en:
        'Set a date and time for when to send out these deliveries. \n - By default we will send out deliveries immediately. \n - Note that distribution channels like SMS may have a 5-10 minute delay.',
      de:
        'Legen Sie ein Datum und eine Uhrzeit für den Versand dieser Lieferungen fest. \n - Standardmäßig versenden wir Lieferungen sofort. \n - Beachten Sie, dass Vertriebskanäle wie SMS eine Verzögerung von 5-10 Minuten haben können.',
    },
    character_limit: {
      en: 'Character limit',
      de: 'Zeichenlimit',
    },
    recipient_adress: {
      en: 'Recipient adres',
      de: 'Empfänger adres.',
    },
    import_deliveries: {
      en: 'Import deliveries',
      de: 'Lieferungen importieren',
    },
    back_to_campaigns: {
      en: 'Back to campaigns',
      de: 'Zurück zu den Kampagnen',
    },
    select_campaign: {
      en: 'Select campaign',
      de: 'Kampagne auswählen',
    },
    select_campaign_text: {
      en: 'Select one of the created campaigns',
      de: 'Wählen Sie eine der erstellten Kampagnen aus',
    },
    no_campaigns: {
      en: 'No campaigns have been created yet.',
      de: 'Es wurden noch keine Kampagnen erstellt.',
    },
    edit_variant: {
      en: 'Edit variant',
      de: 'Variante bearbeiten:',
    },
    campaign_email_helper: {
      en: 'Send campaign via email',
      de: 'Kampagne per E-Mail senden',
    },
    campaign_sms_helper: {
      en: 'Send campaign via SMS',
      de: 'Kampagne per SMS senden',
    },
    distribution: {
      en: 'Distribution',
      de: 'Verteilung',
    },
    body: {
      en: 'Body',
      de: 'Teil',
    },
    dialogue: {
      en: 'Dialogue',
      de: 'Dialog',
    },
    create_campaign: {
      en: 'Create a campaign',
      de: 'Eine Kampagne erstellen',
    },
    select_a_variant: {
      en: 'Select a variant',
      de: 'Wählen Sie eine Variante aus',
    },
    variant: {
      en: 'Variant',
      de: 'Variante',
    },
    variants: {
      en: 'Variants',
      de: 'Varianten',
    },
    variants_helper: {
      en:
        'Variants allow you to specify an A/B test for your campaign. You can specify different distribution channels (such as Email or SMS), by setting the probability of the different variants.',
      de:
        'Mit Varianten können Sie einen A / B-Test für Ihre Kampagne angeben. Sie können verschiedene Vertriebskanäle (wie E-Mail oder SMS) angeben, indem Sie die Wahrscheinlichkeit der verschiedenen Varianten festlegen.',
    },
    variant_label: {
      en: 'Variant label',
      de: 'Variantenetikett',
    },
    campaign_label: {
      en: 'Campaign label',
      de: 'Kampagnenetikett',
    },
    campaigns: {
      en: 'Campaigns',
      de: 'Kampagnen',
    },
    is_required: {
      en: 'Is the field required?',
      de: 'Ist das Feld erforderlich?',
    },
    required: {
      en: 'Required',
      de: 'Benötigt',
    },
    not_required: {
      en: 'Not required',
      de: 'Nicht benötigt',
    },
    empty_field: {
      en: 'Empty field',
      de: 'Leeres Feld',
    },
    about_fields_header: {
      en: 'Fields',
      de: 'Felder',
    },
    about_fields_helper: {
      en:
        "With fields, you can request various types of data from your visitor. For example, you are only interested in a visitor's phone number, or perhaps a simple nickname will do.",
      de:
        'Mit Feldern können Sie verschiedene Arten von Daten von Ihrem Besucher anfordern. Zum Beispiel interessieren Sie sich nur für die Telefonnummer eines Besuchers, oder vielleicht reicht ein einfacher Spitzname.',
    },
    empty_field_helper: {
      en: 'Select at least a type',
      de: 'Wählen Sie mindestens einen Typ aus',
    },
    not_required_helper: {
      en: 'User can leave this empty',
      de: 'Benutzer kann dies leer lassen',
    },
    required_helper: {
      en: 'User must fill this in.',
      de: 'Benutzer muss dies in füllen',
    },
    see_interactions: {
      en: 'See it in the interactions table.',
      de: 'Sehen Sie es in der Interaktions-Tabelle.',
    },
    edit_field: {
      en: 'Edit field',
      de: 'Feld bearbeiten',
    },
    select_a_field_type: {
      en: 'Select a field type',
      de: 'Wählen Sie einen Feldtyp aus',
    },
    phoneNumber: {
      en: 'Phone number',
      de: 'Telefonnummer',
    },
    finish_editing: {
      en: 'Finish editing',
      de: 'Bearbeitung beenden',
    },
    delete_field: {
      en: 'Delete field',
      de: 'Feld löschen',
    },
    phoneNumber_type: {
      en: 'Phone number',
      de: 'Telefonnummer',
    },
    phoneNumber_helper: {
      en: 'For phone-number types.',
      de: 'Für Telefonnummerntypen.',
    },
    url_type: {
      en: 'Link',
      de: 'Link',
    },
    url_helper: {
      en: 'For link types',
      de: 'Für URLtypen',
    },
    shortText: {
      en: 'Short text',
      de: 'Kurze Texte',
    },
    shortText_helper: {
      en: 'For generic short texts, like names',
      de: 'Für generische Short-Texte wie Namen',
    },
    shortText_type: {
      en: 'Short text',
      de: 'Kurze Texte',
    },
    longText: {
      en: 'Long text',
      de: 'Langer Text',
    },
    longText_type: {
      en: 'Long text',
      de: 'Langer Text',
    },
    longText_helper: {
      en: 'For generic long texts',
      de: 'Für generische Long-Texte',
    },
    number: {
      en: 'Number',
      de: 'Nummer',
    },
    number_type: {
      en: 'Number',
      de: 'Nummer',
    },
    number_helper: {
      en: 'For generic numbers',
      de: 'Für generische Nummern',
    },
    email_type: {
      en: 'Email',
      de: 'Email',
    },
    add_field_reminder: {
      en: 'Add your first field!',
      de: 'Fügen Sie Ihr erstes Feld hinzu!',
    },
    add_field: {
      en: 'Add field',
      de: 'Feld hinzufügen',
    },
    form_node: {
      en: 'About the form',
      de: 'Über das Formular',
    },
    form_node_helper: {
      en: 'Customize which fields the end-user gets to see.',
      de: 'Passen Sie an, welche Felder der Endbenutzer zu de erhält.',
    },
    label: {
      en: 'Label',
      de: 'Etikette',
    },
    sub_label: {
      en: 'Helper label',
      de: 'Helferetikett',
    },
    recipient: {
      en: 'Recipient',
      de: 'Empfänger',
    },
    condition: {
      en: 'Condition',
      de: 'Bedingung',
    },
    data: {
      en: 'Data',
      de: 'Data',
    },
    edit_trigger: {
      en: 'Edit alert',
      de: 'Alert bearbeiten',
    },
    delete_trigger: {
      en: 'Delete alert',
      de: 'Alert zu löschen',
    },
    text: {
      en: 'Text',
      de: 'Text',
    },
    register: {
      en: 'Register',
      de: 'Registrieren',
    },
    delete_user: {
      en: 'Delete user',
      de: 'Benutzer zu löschen',
    },
    url: {
      en: 'Link',
      de: 'Link',
    },
    invite_user: {
      en: 'Invite user',
      de: 'Benutzer einladen',
    },
    date_range: {
      en: 'Date range',
      de: 'Datumsbereich',
    },
    edit_user: {
      en: 'Edit user',
      de: 'Benutzer bearbeiten',
    },
    logged_out: {
      en: 'Your session has expired',
      de: 'Deine Sitzung ist abgelaufen',
    },
    go_to_login: {
      en: 'Go to login',
      de: 'Zum Login gehen',
    },
    register_helper: {
      en: 'Welcome to haas! Finish your registration by filling in some last details.',
      de:
        'Willkommen! Wir brauchen nur noch ein paar letzte Informationen zum Abschließen der Registration.',
    },
    description: {
      en: 'Description',
      de: 'Beschreibung',
    },
    switch_project: {
      en: 'Switch workspace',
      de: 'Projekt wechseln',
    },
    logout: {
      en: 'Logout',
      de: 'Logout',
    },
    interaction_path: {
      en: 'Path',
      de: 'Pfad',
    },
    server_down: {
      en: 'Oops! There was a problem with the server.',
      de: 'Hoppla! Es gab ein Problem mit dem Server.',
    },
    server_down_helper: {
      en: 'Try again in a second while we take care of the proble.',
      de: 'Versuchen Sie es gleich erneut. Wir kümmern uns um das Problem.',
    },
    add_recipient: {
      en: 'Add recipient',
      de: 'Nutzer hinzufügen',
    },
    tags: {
      en: 'Tags',
      de: 'Tags',
    },
    add_tag: {
      en: 'Add tag',
      de: 'Tag hinzufügen',
    },
    unauthorized: {
      en: 'Whoops! You are unauthorized.',
      de: 'Hoppla! Sie haben dazu keine Erlaubnis.',
    },
    unauthorized_helper: {
      en: 'You do not have the permissions to access this page.',
      de: 'Sie haben nicht die Berechtigung auf diese Seite zuzugreifen.',
    },
    remove: {
      en: 'Remove',
      de: 'Entfernen',
    },
    scheduled: {
      en: 'Scheduled',
      de: 'Geplant',
    },
    question: {
      en: 'Question',
      de: 'Frage',
    },
    both: {
      en: 'Both',
      de: 'Beides',
    },
    sms: {
      en: 'Text-Message',
      de: 'SMS',
    },
    about: {
      en: 'About',
      de: 'Allgemeine Informationen',
    },
    logo: {
      en: 'Logo',
      de: 'Logo',
    },
    grid: {
      en: 'Grid',
      de: 'Raster',
    },
    roles: {
      en: 'Roles',
      de: 'Rollen',
    },
    create: {
      en: 'Create',
      de: 'Erstellen',
    },
    cancel: {
      en: 'Cancel',
      de: 'Abbrechen',
    },
    upload_zone: {
      en: 'Drag the image here, or click here to upload.',
      de: 'Ziehe dein Logo hierher oder klicke um es auszuwählen.',
    },
    upload_zone_replace: {
      en: 'To replace existing image, drag a new image here, or click here to upload.',
      de: 'Ziehe dein Logo hierher oder klicke um es auszuwählen.',
    },
    list: {
      en: 'List',
      de: 'Liste',
    },
    start: {
      en: 'Start',
      de: 'Anfang',
    },
    actions: {
      en: 'Actions',
      de: 'Aktionen',
    },
    adminpanel: {
      en: 'Admin Panel',
      de: 'Admin Bereich',
    },
    stay_tuned: {
      en: 'Stay tuned',
      de: 'Bleib dabei',
    },
    projects: {
      en: 'Workspaces',
      de: 'Projekte',
    },
    existing_url: {
      en: 'Existing URL',
      de: 'Existierende URL',
    },
    existing_url_helper: {
      en: 'Insert existing URL',
      de: 'Füge eine existierende URL hinzu',
    },
    upload_file: {
      en: 'Upload file',
      de: 'Date hochladen',
    },
    upload_file_helper: {
      en: 'Upload a file',
      de: 'Wähle eine Datei aus',
    },
    logo_existing_url: {
      en: 'Logo: existing URL',
      de: 'Logo: vorhandene URL',
    },
    logo_existing_url_helper: {
      en: 'Use the URL of an existing logo. We recommend one with no background colors.',
      de:
        'Verwenden Sie die URL eines vorhandenen Logos. Am besten klappt es wenn es keine Hintergrundfarbe hat.',
    },
    logo_upload: {
      en: 'Logo: Drag and Drop',
      de: 'Logo: Drag and Drop',
    },
    logo_upload_helper: {
      en: 'Upload a logo. For better quality choose SVG or PNG.',
      de: 'Lade ein Logo hoch. SVG oder PNG Dateien haben oft bessere Qualität.',
    },
    active_projects: {
      en: 'Active workspaces',
      de: 'Aktuelle Partner',
    },
    welcome_to_haas: {
      en: 'Welcome to haas!',
      de: 'Willkommen bei haas!',
    },
    welcome_to_haas_helper: {
      en:
        'It seems like this is your first time using haas. For starters, feel free to fill in the following information get set-up.',
      de:
        'Es scheint so als würdest du haas zum ersten Mal verwenden. Für den Anfang, kannst du die folgenden Informationen eingeben, um die Einrichtung zu erleichtern.',
    },
    stay_tuned_helper: {
      en: 'A new feature is coming soon.',
      de: 'Bald kommt eine neue Funktion.',
    },
    end: {
      en: 'End',
      de: 'Ende',
    },
    edit: {
      en: 'Edit',
      de: 'Bestätigen',
    },
    add_call_to_action: {
      en: 'Add Call-to-Action',
      de: 'Call-to-Action hinzufügen',
    },
    options: {
      en: 'Options',
      de: 'Optionen',
    },
    add_question: {
      en: 'Add question',
      de: 'Frage hinzufügen',
    },
    depth: {
      en: 'Depth',
      de: 'Tiefe',
    },
    role: {
      en: 'Role',
      de: 'Rolle',
    },
    min_value: {
      en: 'Minimum value',
      de: 'Minimalwert',
    },
    video_embedded: {
      en: 'Embedded video ID',
      de: 'Eingebettete Video-ID',
    },
    video_embedded_helper: {
      en: `What is the ID of the video you want to display at the question?
This ID can be found in the URL of the video. Currently only youtube is supported.`,
      de: `Wie lautet die ID des Videos, das Sie anzeigen möchten?
Sie finden diese ID in der URL des Videos. Derzeit wird nur YouTube unterstützt.`,
    },
    max_value: {
      en: 'Maximum value',
      de: 'Maximalwert',
    },
    search: {
      en: 'Search',
      de: 'Suche',
    },
    save: {
      en: 'Save',
      de: 'Speichern',
    },
    date: {
      en: 'Date',
      de: 'Datum',
    },
    delete: {
      en: 'Delete',
      de: 'Löschen',
    },
    title: {
      en: 'Title',
      de: 'Titel',
    },
    none: {
      en: 'None',
      de: 'Keiner',
    },
    visit: {
      en: 'Visit',
      de: 'Besuchen',
    },
    delete_dialogue_popover: {
      en:
        'You are about to delete a dialogue and all related data. This cannot be undone! Are you sure?',
      de:
        'Du bist dabei ein Dialog mit allen dazugehörigen data zu löschen. Dies kann nicht rückgängig gemacht werden! Bist du dir sicher?',
    },
    delete_customer_popover: {
      en:
        'You are about to delete a workspace and all related questions. This cannot be undone! Are you sure?',
      de:
        'Du bist dabei ein Projekt mit allen dazugehörigen Fragen zu löschen. Dies kann nicht rückgängig gemacht werden! Bist du dir sicher?',
    },
    delete_question_popover: {
      en:
        'You are about to delete a question and all attached sub-questions. This cannot be undone! Are you sure?',
      de:
        'Du bist dabei eine Frage und alle dazugehörigen Unterfragen zu löschen. Dies kann nicht rückgängig gemacht werden! Bist du dir sicher?',
    },
    delete_cta_popover: {
      en: 'You are about to delete a Call-to-Action. This cannot be undone! Are you sure?',
      de:
        'Du bist dabei einen Call-To-Action zu löschen. Dies kann nicht rückgängig gemacht werden! Bist du dir sicher?',
    },
    delete_trigger_popover: {
      en: 'You are about to delete an alert. This cannot be undone! Are you sure?',
      de:
        'Du bist dabei eine Push-Benachrichtugung zu löschen. Dies kann nicht rückgängig gemacht werden! Bist du dir sicher?',
    },
    delete_user_popover: {
      en: 'You are about to delete a user. This cannot be undone! Are you sure?',
      de:
        'Du bist dabei einen Benutzer zu löschen. Dies kann nicht rückgängig gemacht werden! Bist du dir sicher?',
    },
    create_trigger: {
      en: 'Create alert',
      de: 'Push-Benachrichtung erstellen',
    },
    page: {
      en: 'Page',
      de: 'Seite',
    },
    user: {
      en: 'User',
      de: 'Benutzer',
    },
    no_registration: {
      en: 'No registration',
      de: 'Keine Registrierung',
    },
    call_to_action: {
      en: 'Call-to-Action',
      de: 'Call-to-Action',
    },
    about_call_to_action: {
      en: 'About the Call-to-Action',
      de: 'Über den Call-to-Action',
    },
    create_dialogue: {
      en: 'Create dialogue',
      de: 'Dialog erstellen',
    },
    dialogues: {
      en: 'Dialogues',
      de: 'Dialog',
    },
    score: {
      en: 'Score',
      de: 'Ergebnis',
    },
    export_to_csv: {
      en: 'CSV export',
      de: 'CSV Export',
    },
    match_value: {
      en: 'Match value',
      de: 'Übereinstimmungswert',
    },
    match_value_helper: {
      en: 'What is the multiple choice question to trigger this follow-up?',
      de: 'Wie lautet die Multiple-Choice-Frage um zu diesem Punkt zu gelangen?',
    },
    user_actions: {
      en: 'Actions',
      de: 'Aktionen',
    },
    no_data: {
      en: 'No data available',
      de: 'Keine Daten verfügbar',
    },
    personalize: {
      en: 'Personalize',
      de: 'Personalisieren',
    },
    share: {
      en: 'Share',
      de: 'Teilen',
    },
    language: {
      en: 'Language',
      de: 'Sprache',
    },
    analytics: {
      en: 'Analytics',
      de: 'Analyse',
    },
    users: {
      en: 'Users',
      de: 'Benutzer',
    },
    alerts: {
      en: 'Alerts',
      de: 'Alerts',
    },
    settings: {
      en: 'Settings',
      de: 'Einstellungen',
    },
    latest_interactions: {
      en: 'Latest interactions',
      de: 'Die letzten Interaktionen',
    },
    overview: {
      en: 'Overview',
      de: 'Übersicht',
    },
    interactions: {
      en: 'Interactions',
      de: 'Interaktionen',
    },
    interaction: {
      en: 'Interaction',
      de: 'Interaktion',
    },
    view_all: {
      en: 'View all',
      de: 'Alle anzeigen',
    },
    english: {
      en: 'English',
      de: 'Englisch',
    },
    german: {
      en: 'German',
      de: 'Deutsch',
    },
    about_helper: {
      en: 'About',
      de: 'Allgemeines',
    },
    branding: {
      en: 'Branding',
      de: 'Branding',
    },
    branding_color: {
      en: 'Branding color',
      de: 'Markenfarbe',
    },
    name: {
      en: 'Name',
      de: 'Name',
    },
    first_name: {
      en: 'First Name',
      de: 'Vorname',
    },
    first_name_helper: {
      en: "What is the user's first name?",
      de: 'Wie lautet der Vorname des Benutzers?',
    },
    last_name: {
      en: 'Last name',
      de: 'Nachname',
    },
    last_name_helper: {
      en: "What is the user's last name?",
      de: 'Wie lautet der Nachname des Benutzers?',
    },
    email: {
      en: 'Email address',
      de: 'Emailadresse',
    },
    email_helper: {
      en: "What is the user's email address?",
      de: 'Was lautet die E-Mail?',
    },
    phone: {
      en: 'Phone number',
      de: 'Telefonnummer',
    },
    last_updated: {
      en: 'Last update {{date}} ago',
      de: 'Das letzte Update war vor: {{date}}',
    },
    phone_helper: {
      en: "What is the user's phone number? Start with the country code. Example: +316123456",
      de:
        'Wie lautet die Telefonnummer des Benutzers? Beginne mit der Landesvorwahl. Beispiel: +496123456',
    },
    name_helper: {
      en: 'What is the name of your workspace?',
      de: 'Wie lautet der Name deines Unternehmens?',
    },
    role_selector: {
      en: 'User role',
      de: 'Benutzerrolle',
    },
    role_selector_helper: {
      en: "What will be the user's role?",
      de: 'Welche Rolle soll der Benutzer haben?',
    },
    slug: {
      en: 'URL extension',
      de: 'URL Erweiterung',
    },
    slug_helper: {
      en: 'What should be your unique URL-addition?',
      de: 'Was möchtest du für eine URL-Erganzüng?',
    },
    template: {
      en: 'Template',
      de: 'Muster',
    },
    add_complete_title: {
      en: 'Added!',
      de: 'Hinzugefügt!',
    },
    add_complete_description: {
      en: 'The Call-to-Action has been created.',
      de: 'Der Call-to-Action wurde erstellt.',
    },
    edit_complete_title: {
      en: 'Edit complete',
      de: 'Bearbeiten abgeschlossen',
    },
    edit_complete_description: {
      en: 'The Call-to-Action has been edited.',
      de: 'Der Call-to-Action wurde bearbeitet.',
    },
  },
  register: {
    token_not_found: {
      en: 'Token not found',
      de: 'Token nicht gefunden',
    },
    token_not_found_helper: {
      en: 'Your invitation token cannot be found. Try requesting your login again.',
      de: 'Dein Einladungstoken kann nicht gefunden werden. Versuche einen erneuten Login.',
    },
  },
  autodeck: {
    custom_fields: {
      en: 'Custom fields',
      de: 'Custom fields',
    },
    custom_fields_helper: {
      en: 'Add custom fields to an existing template',
      de: 'Add custom fields to an existing template',
    },
    company_name: {
      en: 'Company name',
      de: '',
    },
    company_name_helper: {
      en: 'The name of the target company',
      de: '',
    },
    sorry_about_x: {
      en: 'Sorry about X',
      de: 'Entschuldigung für X',
    },
    sorry_about_x_helper: {
      en: 'Something the target user did not like',
      de: 'Something the target user did not like',
    },
    you_love_x: {
      en: 'You love X',
      de: 'Du liebst X',
    },
    you_love_x_helper: {
      en: 'Something the target user loves',
      de: 'The "You love X" message',
    },
    reward: {
      en: 'Reward',
      de: '',
    },
    reward_helper: {
      en: 'The reward the target user will receive',
      de: '',
    },
    email_content: {
      en: 'Email content',
      de: '',
    },
    email_content_helper: {
      en: 'The content of the email sent to the target user',
      de: '',
    },
    text_content: {
      en: 'SMS content',
      de: '',
    },
    text_content_helper: {
      en: 'The content of the SMS sent to the target user',
      de: '',
    },
    use_rembg: {
      en: 'Remove background',
      de: 'Hintergrund entfernen',
    },
    use_rembg_helper: {
      en: 'Remove background from logo',
      de: 'Entfernen Sie den Hintergrund vom Logo',
    },
    original_image: {
      en: 'Original image',
      de: 'Originales Logo',
    },
    original_image_helper: {
      en: 'Use original logo',
      de: 'Verwenden Sie das Original-Logo',
    },
    download_result: {
      en: 'Download result',
      de: 'Download result',
    },
    primary_color: {
      en: 'Primary color',
      de: 'Primary color',
    },
    primary_color_helper: {
      en: 'Choose between extracting the primary color from the logo or selecting a customer color',
      de: 'Choose between extracting the primary color from the logo or selecting a customer color',
    },
    logo_color: {
      en: 'Logo color',
      de: 'Logo color',
    },
    logo_color_helper: {
      en: 'Color from logo',
      de: 'Color from logo',
    },
    custom_color: {
      en: 'Custom color',
      de: 'Custom color',
    },
    custom_color_helper: {
      en: 'Select custom color',
      de: 'Select custom color',
    },
    create_job: {
      en: 'Create job',
      de: 'Aufgabe erstellen',
    },
    job_name: {
      en: 'Name',
      de: 'Name',
    },
    dialogue: {
      en: 'Dialogue',
      de: 'Dialog',
    },
    dialogue_helper: {
      en: 'Personalize the content of the example dialogue on the sales material.',
      de: 'Personalize the content of the example dialogue on the sales material.',
    },
    client_first_name: {
      en: 'Client first name',
      de: 'Client first name',
    },
    client_first_name_helper: {
      en: 'Fill in the first name of the client targeted by the sales documents',
      de: 'Fill in the first name of the client targeted by the sales documents',
    },
    answer_1: {
      en: 'Answer 1',
      de: 'Answer 1',
    },
    answer_1_helper: {
      en: 'What is the first answer of the multi-choice example?',
      de: 'What is the first answer of the multi-choice example?',
    },
    answer_2: {
      en: 'Answer 2',
      de: 'Answer 2',
    },
    answer_2_helper: {
      en: 'What is the second answer of the multi-choice example?',
      de: 'What is the second answer of the multi-choice example?',
    },
    answer_3: {
      en: 'Answer 3',
      de: 'Answer 3',
    },
    answer_3_helper: {
      en: 'What is the third answer of the multi-choice example?',
      de: 'What is the third answer of the multi-choice example?',
    },
    answer_4: {
      en: 'Answer 4',
      de: 'Answer 4',
    },
    answer_4_helper: {
      en: 'What is the fourth answer of the multi-choice example?',
      de: 'What is the fourth answer of the multi-choice example?',
    },
    website: {
      en: 'Website URL',
      de: 'Website URL',
    },
    website_helper: {
      en: 'What is the website of the target company?',
      de: 'What is the website of the target company?',
    },
  },
  customer: {
    fake_data: {
      en: 'Placeholder data',
      de: 'Platzhalter-Daten',
    },
    fake_data_helper: {
      en: 'Start with placeholder data',
      de: 'Beginnen Sie mit Platzhalter-Daten',
    },
    use_fake_data: {
      en: 'Generate data',
      de: 'Erzeugen Daten',
    },
    use_fake_data_helper: {
      en: 'Fake data will be generated for your templated dialogue',
      de: 'Gefälschte Daten werden für Ihren Templat-Dialog erzeugt werden',
    },
    no_use_fake_data: {
      en: 'Start with no data',
      de: 'Starten Sie ohne Daten',
    },
    no_use_fake_data_helper: {
      en: 'No data will be generated, for a complete fresh slate.',
      de: 'Es werden keine Daten erzeugt, für einen vollständigen frischen Schiefer.',
    },
    logo_helper: {
      en: 'Choose between uploading your logo or inserting an existing URL.',
      de: 'Verweise mit einer URL auf deine Logo oder lade es selbst hoch.',
    },
    create_customer: {
      en: 'Create workspace',
      de: 'Projekt erstellen',
    },
    about_helper: {
      en: 'Please tell us a bit about the workspace. What should be its name and URL.',
      de: 'Erzähle uns etwas zu deinem Unternehmen. Wie sollen der Name und die URL lauten.',
    },
    branding_color_helper: {
      en: "What is the company's main brand color?",
      de: 'Was ist die Hauptfarbe deiner Marke?',
    },
    branding_helper: {
      en: 'Describe the branding of your company, including logo and color.',
      de: 'Beschreibe die Marke deiner Firma.',
    },
    name_helper: {
      en: 'What is the name of your workspace?',
      de: 'Wie heißt dein Unternehmen?',
    },
    slug_helper: {
      en: 'Under which URL segment will visitors find the workspace?',
      de: 'Unter welcher URL Erganzüng sollen Besucher dich finden?',
    },
    use_template: {
      en: 'Use a template',
      de: 'Benutze ein Muster',
    },
    use_template_helper: {
      en: 'Start the onboarding with a pre-existing template, or start fresh.',
      de: 'Beginne mit einem Muster oder starte neu.',
    },
    template_helper: {
      en: 'Choose a startup preference.',
      de: 'Wähle deine Starteinstellung.',
    },
    custom_template: {
      en: 'Custom template',
      de: 'Benutzerdefiniertes Muster',
    },
    custom_template_helper: {
      en: 'Start with a default dialogue.',
      de: 'Neuanfang mit einem Standarddialog.',
    },
    no_custom_template: {
      en: 'Fresh start',
      de: 'Neuanfang',
    },
    no_custom_template_helper: {
      en: 'Start with a clean slate',
      de: 'Beginne komplett neu',
    },
  },
  views: {
    configurations: {
      en: 'Configurations',
      de: 'Konfigurationen',
    },
    invite_user: {
      en: 'Invite user',
      de: 'Benutzer einladen',
    },
    add_dialogue_view: {
      en: 'Add dialogue',
      de: 'Dialog hinzufügen',
    },
    edit_dialogue_view: {
      en: 'Edit dialogue',
      de: 'Dialog einstellen',
    },
    edit_trigger_view: {
      en: 'Edit alert',
      de: 'Alert einstellen',
    },
    dialogue_view: {
      en: 'Overview',
      de: 'Übersicht',
    },
    cta_view: {
      en: 'Call-to-Actions',
      de: 'Call-to-Actions',
    },
    builder_view: {
      en: 'Dialogue Builder',
      de: 'Dialogkonstruktor',
    },
    interactions_view: {
      en: 'Interactions',
      de: 'Interaktionen',
    },
    personalize: {
      en: 'Personalize',
      de: 'Personalisieren',
    },
    trigger_overview: {
      en: 'Alerts',
      de: 'Alerts',
    },
    edit_business_settings_view: {
      en: 'Edit workspace settings',
      de: 'Wähle Unternehmenseinstellungen',
    },
    create_trigger_view: {
      en: 'Create alert',
      de: 'Neue Push-Benachrichtigung',
    },
    create_user_view: {
      en: 'Create user',
      de: 'Benutzer erstellen',
    },
    users_overview: {
      en: 'Users and roles',
      de: 'Benutzer und Rollen',
    },
    admin_overview: {
      en: 'Admin Panel',
      de: 'Administratie Paneel',
    },
  },
  user: {
    roles_helper: {
      en: 'Decide and assign roles for access control.',
      de: 'Entscheiden Sie Rollen für Zugriffsberechtigungen.',
    },
    create_user: {
      en: 'Create user',
      de: 'Benutzer erstellen',
    },
    about_user: {
      en: 'About the user',
      de: 'Benutzerinformationen',
    },
    about_user_helper: {
      en: 'Tell us about the user.',
      de: 'Erzählen Sie uns etwas über den Benutzer.',
    },
  },
  admin: {
    userId: {
      en: 'User Id',
      de: 'Benutzeridentifikation',
    },
    userFName: {
      en: 'First Name',
      de: 'Vorname',
    },
    userLName: {
      en: 'Last Name',
      de: 'Nachname',
    },
    userPermissions: {
      en: 'Permission',
      de: 'Genehmigung',
    },
  },
  dialogue: {
    choices: {
      en: 'Choices',
      de: 'Entscheidungen',
    },
    choices_helper: {
      en:
        'Choices of this question define what potential answer a visitor can give. Furthermore, it is also possible to optionally connect a Call-to-Action to the option the user selects. Note: if a Call-to-Action further in the journey is setup, this one will be overriden.',
      de:
        'Die Auswahl dieser Frage definiert, welche potenzielle Antwort ein Besucher geben kann. Darüber hinaus ist es auch möglich, optional eine Handlungsaufforderung mit der vom Benutzer ausgewählten Option zu verbinden. Hinweis: Wenn eine Handlungsaufforderung weiter unten auf der Reise eingerichtet wird, wird diese überschrieben.',
    },
    finisher_heading: {
      en: 'Dialogue finisher heading',
      de: 'Überschrift des Dialog-Finishers',
    },
    finisher_heading_helper: {
      en: 'What is the main heading at the top of the dialogue finish?',
      de: 'Was ist die Hauptüberschrift an der Spitze des Dialogs?',
    },
    finisher_subheading: {
      en: 'Dialogue finisher subheading',
      de: 'Zwischenüberschrift des Dialog-Finishers',
    },
    finisher_subheading_helper: {
      en: 'What is the sub-heading at the bottom of the dialogue finish?',
      de: 'Was ist die Subüberschrift am Boden des Dialogs?',
    },
    dialogue_finisher: {
      en: 'Dialogue finisher',
      de: 'Dialogue-Finisher',
    },
    dialogue_finisher_helper: {
      en: 'The dialogue finisher is the very last page shown after finalizing a CTA. In this section you can adjust the heading and subheading of this page.',
      de: 'Der Dialog-Finisher ist die letzte Seite, die nach dem Abschluss eines CTA angezeigt wird. In diesem Abschnitt können Sie die Überschrift und Unterüberschrift dieser Seite anpassen.',
    },
    satisfaction_texts: {
      en: 'Satisfaction texts',
      de: 'Satisfaction texts',
    },
    satisfaction_texts_helper: {
      en: 'Satisfaction texts are the texts shown on both sides of the slider. You can edit the relevant texts, or leave them as we defined originally. ',
      de: 'Legen Sie die Zufriedenheitstexte fest, die auf beiden Seiten des Schiebereglers angezeigt werden',
    },
    happyText: {
      en: 'Happy text',
      de: 'Fröhlicher Text',
    },
    happyText_helper: {
      en: 'What will be the text on the right side of the slider indicating a very satisfied user?',
      de: 'Welcher Text auf der rechten Seite des Schiebereglers weist auf einen sehr zufriedenen Benutzer hin?',
    },
    unhappyText: {
      en: 'Unhappy text',
      de: 'Unglücklicher Text',
    },
    unhappyText_helper: {
      en: 'What will be the text on the left side of the slider indicating a very dissatisfied user?',
      de: 'Welcher Text auf der linken Seite des Schiebereglers weist auf einen sehr unzufriedenen Benutzer hin?',
    },
    use_custom_satisfaction_text: {
      en: 'Use custom text',
      de: 'Benutzerdefinierten Text verwenden',
    },
    do_not_use_custom_satisfaction_text: {
      en: 'Do not use custom text',
      de: 'Verwenden Sie keinen benutzerdefinierten Text',
    },
    markers: {
      en: 'Markers',
      de: 'Marker',
    },
    markers_helper: {
      en:
        'Markers are points in the slider of particular significance for the end-user. You can edit the relevant texts, or leave them as we defined originally. An additional helper label can be used to help your customer express themselves better.',
      de:
        'Marker sind Punkte in Ihrem Schieberegler, die für den Endbenutzer von besonderer Bedeutung sind. Sie können die relevanten Texte anhand unserer (derzeit vordefinierten) Texte bearbeiten oder sie ursprünglich definiert lassen. Ein zusätzliches Unteretikett kann verwendet werden, damit sich Ihre Kunden besser ausdrücken können.',
    },
    data_helper: {
      en: 'Your data settings, such as data-sources, will be set here.',
      de: 'Ihre Dateneinstellungen, wie z. B. Datenquellen, werden hier festgelegt',
    },
    about_choice: {
      en: 'About the choices',
      de: 'Über die Auswahl',
    },
    about_choice_helper: {
      en: 'Define the different choices a user can select.',
      de: 'Definieren Sie die verschiedenen Auswahlmöglichkeiten, die ein Benutzer auswählen kann.',
    },
    hide_fake_data: {
      en: 'Hide placeholder data',
      de: 'Ausblenden Platzhalter-Daten',
    },
    hide_fake_data_helper: {
      en: 'Decide whether to use placeholder data in your analytics.',
      de: 'Entscheiden Sie, ob Platzhalterdaten in Ihrer Analyse verwendet werden sollen.',
    },
    do_hide_fake_data_helper: {
      en: "Don't include placeholder data in the analytics.",
      de: 'Platzhalterdaten nicht in die Analyse einbeziehen.',
    },
    no_hide_fake_data: {
      en: 'Show placeholder data.',
      de: 'Platzhalterdaten anzeigen.',
    },
    no_hide_fake_data_helper: {
      en: 'Show placeholder data in the analytics.',
      de: 'Platzhalterdaten in der Analyse anzeigen',
    },
    tag_helper: {
      en: 'Would you like to assign tags for your dialogue?',
      de: 'Möchtest du deinen Dialog mit einem "Tag" verbinden?',
    },
    use_template: {
      en: 'Use template',
      de: 'Benutze ein Muster',
    },
    use_template_helper: {
      en: 'Choose what type of template you would like to use.',
      de: 'Welches Muster möchtest du gerne benutzen?',
    },
    about: {
      en: 'About the dialogue',
      de: 'Informationen zum Dialog',
    },
    description_helper: {
      en: 'How would you describe the dialogue?',
      de: 'Hier kannst du den Dialog allgemein beschreiben.',
    },
    description_placeholder: {
      en: 'Description',
      de: 'Beschreibung',
    },
    about_helper: {
      en: 'General information about your dialogue, such as its general title, at what URL it can be found, and a readable description.',
      de: 'Allgemeine Informationen zu Ihrem Dialog, z. B. seines allgemeinen Titels, in welcher URL ermittelt, und eine lesbare Beschreibung.',
    },
    title_helper: {
      en: 'What is the name of the dialogue?',
      de: 'Welchen Titel soll der Dialog haben?',
    },
    title_placeholder: {
      en: 'Title',
      de: 'Titel',
    },
    public_title: {
      en: 'Display title',
      de: 'Öffentlicher Titel',
    },
    public_title_helper: {
      en: '(Optional): If set, will be shown to the user instead of actual title.',
      de: '(Optional): Wird dem Nutzer anstelle des eigentlichen Titels gezeigt.',
    },
    public_title_placeholder: {
      en: 'Display Title',
      de: 'Angezeigter Titel',
    },
    template_helper: {
      en: 'Do you wish to start a fresh dialogue or use a haas template for reference?',
      de: 'Möchtest du einen neuen Dialog erstellen oder mit einem haas Muster anfangen?',
    },
    min_value_helper: {
      en: 'What is the minimum value to trigger the following question?',
      de: 'Welcher Mindestwert soll die Folgefrage auslösen?',
    },
    max_value_helper: {
      en: 'What is the maximum value to trigger the following question?',
      de: 'Welcher Maximalwert soll die Folgefrage auslösen?',
    },
    about_type_helper: {
      en: 'Describe the question type.',
      de: 'Details zur Frage.',
    },
    question_type: {
      en: 'Question type',
      de: 'Art der Frage',
    },
    question_type_helper: {
      en: 'What is question type?',
      de: 'Welche Art von Frage soll gestellt werden?',
    },
    cta_helper: {
      en: 'Which Call-to-Action do you want to add?',
      de: 'Welchen Call-to-Action möchtest du hinzufügen?',
    },
    add_option_reminder: {
      en: 'Please add an option.',
      de: 'Füge ein Option hinzu.',
    },
    empty_option_reminder: {
      en: 'Please fill in at least one option.',
      de: 'Bitte triff mindestens eine Auswahl.',
    },
    about_slider: {
      en: 'About the slider',
      de: 'Über den Schieberegler',
    },
    about_slider_helper: {
      en: 'Describe the slider markers here.',
      de: 'Beschreiben Sie hier die Schiebermarker.',
    },
    about_question: {
      en: 'About question',
      de: 'Hauptfrage',
    },
    condition: {
      en: 'Condition',
      de: 'Kondition',
    },
    condition_helper: {
      en: 'When should this question be displayed?',
      de: 'Wann soll diese Frage gestellt werden?',
    },
    title_question_helper: {
      en: 'What is the question you want to ask?',
      de: 'Welche Frage soll gestellt werden?',
    },
    about_question_helper: {
      en: 'Tell us about your question.',
      de: 'Wie lautet deine Hauptfrage?',
    },
    average_score: {
      en: 'Average score',
      de: 'Durchschnittliche Bewertung',
    },
    fold_branch: {
      en: 'Fold branch',
      de: 'Abzweigung verstecken',
    },
    expand_branch: {
      en: 'Expand branch',
      de: 'Abzweigung zeigen',
    },
    frequently_mentioned: {
      en: 'Frequently mentioned',
      de: 'Häufig erwähnt',
    },
    notable_paths_of_last_week: {
      en: 'Most frequent interactions of last week',
      de: 'Die häufigsten Interaktionen der Woche',
    },
    notable_paths_of_last_hour: {
      en: 'Most frequent interactions of last hour',
      de: 'Die häufigsten Interaktionen der Stunde',
    },
    notable_paths_of_last_day: {
      en: 'Most frequent interactions of today',
      de: 'Die häufigsten Interaktionen heute',
    },
    notable_paths_of_last_month: {
      en: 'Most frequent interactions of last month',
      de: 'Die häufigsten Interaktionen der Monat',
    },
    score_over_time: {
      en: 'Score over time',
      de: 'Bewertungsdiagramm',
    },
    top_positive_paths: {
      en: 'Positive interactions',
      de: 'Positive Interaktionen',
    },
    top_negative_paths: {
      en: 'Negative interactions',
      de: 'Negative Interaktionen',
    },
    fallback_no_positive_paths: {
      en: 'No positive interactions recorded so far.',
      de: 'Bisher gab es noch keine positiven Interaktionen.',
    },
    fallback_no_negative_paths: {
      en: 'No negative interactions recorded so far.',
      de: 'Bisher gab es noch keine negativen Interaktionen.',
    },
    fallback_no_keywords: {
      en: 'No keywords mentioned yet',
      de: 'Bisher noch keine Themen',
    },
    view_all_mentions: {
      en: 'View all',
      de: 'Alle anzeigen',
    },
    fallback_no_score: {
      en: 'No score calculated yet',
      de: 'Noch kein Ergebnis berechenbar',
    },
    fallback_no_interactions: {
      en: 'No interactions yet',
      de: 'Es gab noch keine Interaktionen',
    },
    latest_data: {
      en: 'Latest data',
      de: 'Aktuelle Trends',
    },
    slug_helper: {
      en: 'Which URL-segment should lead to the dialogue?',
      de: 'Unter welcher URL-Erganzüng sollen Besucher deinen Dialog finden?',
    },
    share_qr: {
      en: 'Method one: Share the QR Code',
      de: 'Erste Methode: Teile den QR-Code',
    },
    share_link: {
      en: 'Method two: Share the link',
      de: 'Zweite Methode: Teile den Link',
    },
    qr_download_helper: {
      en: 'Give access to the dialogue by sharing the QR code. It can be copied or downloaded.',
      de:
        'Teile den QR-Code, um Zugang zu dem Dialog zu geben. Er steht zum kopieren oder downloaded bereit.',
    },
    last_week: {
      en: 'Last 7 days',
      de: 'Letzten 7 Tage',
    },
    last_week_summary: {
      en: "This week's summary",
      de: 'Wochenansicht',
    },
    last_month: {
      en: 'Last month',
      de: 'Im vergangenen Monat',
    },
    last_month_summary: {
      en: "This month's summary",
      de: 'Monat Zusammenfassung',
    },
    last_day: {
      en: 'Last 24 hours',
      de: 'Letzte 24 Stunden',
    },
    last_day_summary: {
      en: "Today's summary",
      de: 'Heuete Zusammenfassung',
    },
    last_hour: {
      en: 'Last hour',
      de: 'Letzte Stunde',
    },
    last_hour_summary: {
      en: "Hourly's summary",
      de: 'Stündliche Zusammenfassung',
    },
  },
  interactions: {
    user_data: {
      en: 'User data',
      de: 'Benutzerdaten',
    },
    user_information: {
      en: 'User information',
      de: 'Benutzerinformation',
    },
    watch_journey_heading: {
      en: "Follow a user's journey",
      de: 'Folge eine Benutzererfahrung',
    },
    you_asked: {
      en: 'You asked',
      de: 'Du hast gefragt',
    },
    they_answered: {
      de: 'Sie antworteten',
      en: 'They answered',
    },
  },
  toast: {
    campaign_created: {
      en: 'Campaign created!',
      de: 'Kampagne erstellt!',
    },
    campaign_created_helper: {
      en: 'A new campaign has been created.',
      de: 'Eine neue Kampagne wurde erstellt.',
    },
    delete_node: {
      en: '',
      de: '',
    },
    delete_node_helper: {
      en: '',
      de: '',
    },
    delete_node_error_helper: {
      en: '',
      de: '',
    },
    something_went_wrong: {
      en: 'Something went wrong',
      de: 'Etwas ist schief gelaufen',
    },
    welcome: {
      en: 'Welcome!',
      de: 'Willkommen!',
    },
    welcome_on_board_helper: {
      en: 'Welcome on board!',
      de: 'Willkommen an Bord!',
    },
    locale_switch: {
      en: 'Switched language',
      de: 'Sprache gewechselt',
    },
    locale_switch_german: {
      en: 'Switched language to German',
      de: 'Sprache auf Deutsch umgestellt',
    },
    locale_switch_english: {
      en: 'Switched language to English',
      de: 'Sprache auf Englisch umgestellt',
    },
    user_edited: {
      en: 'User edited!',
      de: 'Benutzer bearbeitet',
    },
    user_edited_helper: {
      en: 'Your details have been saved.',
      de: 'Ihre Daten wurden gespeichert.',
    },
  },
  cta: {
    about_share: {
      en: 'About the share',
      de: 'Über den Anteil',
    },
    about_share_helper: {
      en:
        'Configure the share button, what the end-user gets to share, and what the button displays.',
      de:
        'Konfigurieren Sie die Schaltfläche "Teilen", was der Endbenutzer freigeben darf und was auf der Schaltfläche angezeigt wird.',
    },
    text: {
      en: 'Text to share',
      de: 'Text zum Teilen',
    },
    shared_item_text_helper: {
      en: 'What text should be shared with the link?',
      de: 'Was Text soll den Link geteilt werden',
    },
    add_complete_title: {
      en: 'Added!',
      de: 'Hinzugefügt!',
    },
    add_complete_description: {
      en: 'The Call-to-Action has been created.',
      de: 'Der Call-to-Action wurde erstellt.',
    },
    edit_complete_title: {
      en: 'Edit complete',
      de: 'Bearbeiten abgeschlossen',
    },
    edit_complete_description: {
      en: 'The Call-to-Action has been edited.',
      de: 'Der Call-to-Action wurde bearbeitet.',
    },
    information_header: {
      en:
        'Configure general information about this Call-to-Action, such as the text displayed, and the "type".',
      de:
        'Konfigurieren Sie allgemeine Informationen zu dieser Handlungsaufforderung, z. B. den angezeigten Text und den "Typ".',
    },
    title_helper: {
      en: 'What is the header text of the Call-to-Action?',
      de: 'Was ist der Haupttext des Call-to-Action?',
    },
    shared_item_title_helper: {
      en: 'What is the title of the shared item?',
      de: 'Wie lautet der Titel des freigegebenen Elements?',
    },
    type: {
      en: 'Type',
      de: 'Typ',
    },
    share_type_helper: {
      en: 'What is the type of the Call-to-Action?',
      de: 'Was ist der Typ des Call-to-Action?',
    },
    url: {
      en: 'Url',
      de: 'Url',
    },
    url_share_helper: {
      en: 'What is the link you wish to share?',
      de: 'Welche URL soll geteilt werden?',
    },
    button_text: {
      en: 'Button text',
      de: 'Schaltflächentext',
    },
    button_text_helper: {
      en: 'What is the text on the share button?',
      de: 'Was ist der Text der Share-Schaltfläche',
    },
    link_header: {
      en: 'What links do you want to add to the Call-to-Action?',
      de: 'Welche Links möchten Sie zum Call-to-Action hinzufügen?',
    },
    add_link: {
      en: 'Add link',
      de: 'Link hinzufügen',
    },
    link_url_helper: {
      en: 'What is the url the link should lead to?',
      de: 'Zu welcher URL sollte der Link führen?',
    },
    link_type_helper: {
      en: 'What is the type of the link?',
      de: 'Was ist der typ des Links?',
    },
    link_tooltip: {
      en: 'Tooltip',
      de: 'Tooltip',
    },
    link_tooltip_helper: {
      en: 'What is the text when hovering over the link?',
      de: 'Was ist der Text, wenn Sie mit der Maus über den Link fahren?',
    },
    link_icon: {
      en: 'Icon',
      de: 'Symbol',
    },
    link_icon_helper: {
      en: 'What icon is displayed for the link?',
      de: 'Welches Symbol wird für den Link angezeigt?',
    },
    background_color: {
      en: 'Background color',
      de: 'Hintergrundfarbe',
    },
    background_color_helper: {
      en: 'What is the background color for the link?',
      de: 'Was ist die Hintergrundfarbe für den Link?',
    },
    delete_link: {
      en: 'Delete link',
      de: 'Link löschen',
    },
  },
  trigger: {
    condition_placeholder: {
      en: 'Start by adding a condition.',
      de: 'Beginnen Sie mit einer Bedingung hinzugefügt wird.',
    },
    sms_placeholder: {
      en: 'Select one or more recipients to receive the alert notifications.',
      de: 'Wählen Sie einen oder mehrere Empfänger aus, um die Warnmeldungen zu erhalten.',
    },
    select_a_dialogue: {
      en: 'Select a dialogue',
      de: 'Wählen Sie einen Dialog',
    },
    select_dialogue_placeholder: {
      en: 'Before we can setup conditions, you should select a dialogue first.',
      de: 'Bevor wir können Setup Bedingungen, sollten Sie einen Dialog zuerst auswählen.',
    },
    alert_email: {
      en: 'Send alerts to email',
      de: 'Senden per E-Mail',
    },
    alert_sms: {
      en: 'Send alerts via SMS',
      de: 'Senden per SMS',
    },
    alert_both: {
      en: 'Send alerts via all channels',
      de: 'Alle Sendemethoden auswählen',
    },
    trigger_schedulled_alarm: {
      en: 'Send alerts at certain times (coming soon)',
      de: 'Senden der Push-Benachrichtigungen zu bestimmten Zeiten (bald verfügbar)',
    },
    my_first_trigger: {
      en: 'My first alert',
      de: 'Meine erste Push-Notification',
    },
    trigger_question_alarm: {
      en: 'Send alerts when a certain value has been reached',
      de: 'Sende eine Push-Benachrichtigung beim erreichen eines bestimmten Wertes.',
    },
    select_dialogue_reminder: {
      en: 'Please select a type and/or dialogue',
      de: 'Bitte wähle eine Methode und/oder einen Dialog',
    },
    about_trigger: {
      en: 'About the alert',
      de: 'Allgemeine Beschreibung zur Push-Benachrichtigung',
    },
    about_trigger_helper: {
      en: 'Tell us about the alert, and to which question or dialogue it applies.',
      de: 'Beschreibe die Push-Benachrichtigung und für welche Frage oder welchen Dialog Sie gilt.',
    },
    add_condition: {
      en: 'Add condition',
      de: 'Bedingung hinzufügen',
    },
    conditions: {
      en: 'Conditions',
      de: 'Bedingungen',
    },
    conditions_helper: {
      en: 'What are the conditions for sending out the alert?',
      de: 'Welche Bedingungen sollen für das Senden der Push-Benachrichtgung zutreffen?',
    },
    name_helper: {
      en: 'What is the name of this alert?',
      de: 'Wie soll diese Push-Benachrichtigung heißen?',
    },
    dialogue: {
      en: 'Selected dialogue',
      de: 'Ausgewählter Dialog',
    },
    dialogue_helper: {
      en: 'For which dialogue will this alert apply?',
      de: 'Für welchen Dialog gilt diese Push-Benachrichtigung?',
    },
    type: {
      en: 'Alert type',
      de: 'Art der Push-Benachrichtigung',
    },
    type_helper: {
      en: 'What type of alert is this?',
      de: 'Um was für eine Art Push-Benachrichtigung handelt es sich?',
    },
    delivery: {
      en: 'Delivery',
      de: 'Lieferung',
    },
    low_threshold: {
      en: 'Low Threshold',
      de: 'Unterer Schwellenwert',
    },
    low_threshold_helper: {
      en: 'Set a low threshold: if a score underneath is recorded, an alert will be sent.',
      de:
        'Festlegen eines unteren Schwellenwerts: Eine Aufzeichnung unter diesem Wert löst eine Push-Benachrichtigung aus.',
    },
    high_threshold: {
      en: 'High Threshold',
      de: 'Oberer Schwellenwert',
    },
    high_threshold_helper: {
      en: 'Set a high threshold: if a score above is recorded, an alert will be sent',
      de:
        'Festlegen eines oberen Schwellenwerts: Eine Aufzeichung über diesem Wert löst eine Push-Benachrichtigung aus.',
    },
    outer_range: {
      en: 'Outer range',
      de: 'äußerer Bereich',
    },
    outer_range_helper: {
      en:
        'Set an outer range threshold: if a score outside the range is recorded, an alert will be sent',
      de:
        'Festlegen eines Schwellenwerts für den äußeren Bereich: Wenn eine Punktzahl außerhalb des Bereichs aufgezeichnet wird, wird eine Warnung gesendet',
    },
    inner_range: {
      en: 'Inner range',
      de: 'Innerer Bereich',
    },
    inner_range_helper: {
      en:
        'Set an inner range threshold: if a score within the range is recorded, an alert will be sent',
      de:
        'Festlegen eines Schwellenwerts für den inneren Bereich: Wenn eine Punktzahl innerhalb des Bereichs aufgezeichnet wird, wird eine Warnung gesendet',
    },
    delivery_helper: {
      en: 'Shall this alert be deliver via email or text message?',
      de: 'Soll diese Push-Benachrichtigung per Email oder SMS versandt werden?',
    },
    medium: {
      en: 'Delivery medium',
      de: 'Art des Versandts',
    },
    medium_helper: {
      en:
        'Which delivery method is preferred for this alert? Note: additional costs may occur for text messages.',
      de:
        'Welche Versandart wird für diese Push-Benachrichtigung bevorzugt? Hinweis: Für SMS können zusätzliche Kosten anfallen.',
    },
    question: {
      en: 'Selected question',
      de: 'Ausgewählte Frage',
    },
    question_helper: {
      en: 'Which question will the alert be watching?',
      de: 'Auf welche Frage bezieht sich die Push-Benachrichtigung?',
    },
    condition: {
      en: 'Type of condition',
      de: 'Bedingungsart',
    },
    condition_helper: {
      en: 'Which condition should apply to the alert for this question?',
      de: 'Welche Bedingung sollte für den Auslöser Push-Benachrichtigung gelten?',
    },
    recipients: {
      en: 'Recipients',
      de: 'Empfänger',
    },
    recipients_helper: {
      en: 'Who will receive these alerts?',
      de: 'Wer erhält die Push-Benachrichtigung?',
    },
    recipient: {
      en: 'Recipient',
      de: 'Empfänger',
    },
    recipient_helper: {
      en: 'Select a registered user to be the receiver',
      de: 'Wähle einen registrierten Benutzer als Empfänger aus',
    },
    match_text: {
      en: 'Text to match',
      de: 'Passender Text',
    },
    match_text_helper: {
      en: 'What text should be matched to trigger the alert?',
      de: 'Welche Textübereinstimmung soll die Push-Benachrichtigung auslösen?',
    },
  },
};

export const parseLanguages = (language: string, input: any, output?: any) => {
  output = output || {};

  Object.keys(input).forEach((key) => {
    const value = input[key];

    const leaf = typeof value[Object.keys(value)[0]] === 'string';

    if (leaf) {
      if (language in value) {
        output[key] = value[language];
      }
    } else {
      output[key] = {};

      parseLanguages(language, value, output[key]);
    }
  });

  return output;
};

export default language;
