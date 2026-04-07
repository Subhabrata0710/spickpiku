// ============================================================
// SPICK PICU — Monsoon CME Registration Backend
// Google Apps Script — code.gs
// ============================================================

// --- CONFIGURATION ---
const SHEET_ID = '1Q6NSbdPZ5x1x2qf_7e-XKWBQCtBSeyyVwVcIe-CYABM';          // Replace with your Google Sheet ID
const UPLOAD_FOLDER_ID = '1wXPnzyOCzJkTU513unWBkztg9jXfTB_I';  // Replace with your Google Drive folder ID

// Email Placeholders — Replace with actual emails
const EMAIL_FROM_NAME = 'SPICK PICU - Monsoon CME 2026';  // Display name for outgoing emails
const EMAIL_CC = 'mukherjeerohit301@gmail.com';             // CC recipient(s), comma-separated
//const EMAIL_BCC = 'placeholder-bcc@example.com';           // BCC recipient(s), comma-separated

// ============================================================
// HANDLE INCOMING REQUESTS
// ============================================================
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('No data received');
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    let response = {};

    if (action === 'register') {
      response = registerUser(data);
    } else if (action === 'login') {
      response = loginUser(data);
    } else if (action === 'uploadAbstract') {
      response = uploadAbstract(data);
    } else if (action === 'getMyFiles') {
      response = getMyFiles(data);
    } else {
      response = { success: false, message: 'Unknown action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.log('Global Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Server Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for CORS preflight)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'SPICK PICU Registration API is running.'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// HELPER — Get or Create Sheet
// ============================================================
function getSheet(name) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    if (!ss) throw new Error('Could not open spreadsheet');

    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);

      // Set headers for Registrations sheet
      if (name === 'Registrations') {
        sheet.appendRow([
          'Serial No', 'First Name', 'Last Name', 'Email', 'Phone',
          'Affiliation', 'Designation', 'Password', 'Role',
          'Attending Type', 'Workshop Name', 'Food Preference',
          'Amount', 'Payment Screenshot URL', 'Timestamp'
        ]);
        sheet.setFrozenRows(1);
      }
      console.log('Created new sheet: ' + name);
    }
    return sheet;
  } catch (error) {
    console.log('Error in getSheet(' + name + '): ' + error.toString());
    return null;
  }
}

// ============================================================
// REGISTER USER
// ============================================================
function registerUser(data) {
  if (!data || !data.email) {
    return { success: false, message: 'No registration data provided.' };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    const sheet = getSheet('Registrations');
    if (!sheet) return { success: false, message: 'Could not access registration sheet.' };

    const allData = sheet.getDataRange().getValues();

    // Check for duplicate email
    for (let i = 1; i < allData.length; i++) {
      if (allData[i][3] === data.email) {  // Email is column D (index 3)
        return { success: false, message: 'This email is already registered!' };
      }
    }

    // --- Generate Serial Number ---
    // W-1001, W-1002... for Workshop Only
    // WC-1001, WC-1002... for Workshop + Conference
    // N-1001, N-1002... for Nurse Training
    const rowNumber = allData.length; // Next row number (1-indexed, minus header = count)

    let prefix = 'W';
    if (data.attendingType === 'Workshop + Conference') {
      prefix = 'WC';
    } else if (data.attendingType === 'Nursing Workshop') {
      prefix = 'N';
    }

    const serialNumber = prefix + '-' + (1000 + rowNumber);

    // --- Upload Payment Screenshot ---
    let screenshotUrl = '';
    if (data.paymentScreenshot && data.paymentScreenshot.base64) {
      try {
        const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
        const fileName = 'Payment_' + serialNumber + '_' + data.paymentScreenshot.fileName;
        const blob = Utilities.newBlob(
          Utilities.base64Decode(data.paymentScreenshot.base64),
          data.paymentScreenshot.mimeType,
          fileName
        );
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        screenshotUrl = file.getUrl();
      } catch (fileError) {
        console.log('Failed to upload payment screenshot: ' + fileError.toString());
      }
    }

    // --- Generate QR Code, Save to 'QR' Folder, Get URL ---
    const qrText = 'Monsoon CME 2026\n' +
                   'Reg ID: ' + serialNumber + '\n' +
                   'Name: ' + (data.firstName || '') + ' ' + (data.lastName || '') + '\n' +
                   'Role: ' + (data.role || '') + '\n' +
                   'Attending: ' + (data.attendingType || '');
    const qrApiUrl = 'https://quickchart.io/qr?text=' + encodeURIComponent(qrText) + '&margin=2&size=300';
    let savedQrUrl = qrApiUrl; // Default to API URL if Drive save fails
    let globalQrBlob = null;
    
    try {
      const response = UrlFetchApp.fetch(qrApiUrl);
      globalQrBlob = response.getBlob().getAs(MimeType.PNG).setName('Registration_QR_' + serialNumber + '.png');
      
      const parentFolder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
      const qrFolders = parentFolder.getFoldersByName('QR');
      let qrFolder;
      if (qrFolders.hasNext()) {
        qrFolder = qrFolders.next();
      } else {
        qrFolder = parentFolder.createFolder('QR');
      }
      
      const qrFile = qrFolder.createFile(globalQrBlob);
      qrFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      savedQrUrl = qrFile.getUrl(); // Permanent Drive URL
    } catch (qrError) {
      console.log('Failed to save QR code to Drive: ' + qrError.toString());
    }

    // --- Append to Sheet ---
    // Columns: Serial No | First Name | Last Name | Email | Phone |
    //          Affiliation | Designation | Password | Role |
    //          Attending Type | Workshop Name | Food Preference |
    //          Amount | Payment Screenshot URL | QR Code URL | Timestamp
    sheet.appendRow([
      serialNumber,
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.affiliation || '',
      data.designation || '',
      data.password || '',
      data.role || '',
      data.attendingType || '',
      data.workshopName || '',
      data.foodPreference || '',
      data.amount || 0,
      screenshotUrl,
      savedQrUrl,
      new Date()
    ]);

    // --- Send Confirmation Email ---
    try {
      sendConfirmationEmail(data, serialNumber, savedQrUrl, globalQrBlob);
    } catch (emailError) {
      console.log('Email failed but registration saved: ' + emailError.toString());
    }

    return {
      success: true,
      message: 'Registration successful! Your ID: ' + serialNumber + '. A confirmation email has been sent.'
    };

  } catch (e) {
    console.log('Error in registerUser: ' + e.toString());
    return { success: false, message: 'Registration failed: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// SEND CONFIRMATION EMAIL
// ============================================================
function sendConfirmationEmail(data, serialNumber, savedQrUrl, qrBlob) {
  const subject = 'Registration Confirmation — Monsoon CME of Pediatric Intensive Care 2026 [' + serialNumber + ']';
  let inlineBlob = null;
  let attachBlob = null;
  let finalQrPic = false;
  if (qrBlob) {
    try {
      inlineBlob = qrBlob.copyBlob().setName('qrCode.png');
      attachBlob = qrBlob.copyBlob().setName('Registration_QR_' + serialNumber + '.png');
      finalQrPic = true;
    } catch (err) {
      console.log('Failed to copy QR Code blob: ' + err.toString());
    }
  }

  const plainBody =
    'Dear ' + data.firstName + ' ' + data.lastName + ',\n\n' +
    'Thank you for registering for the Monsoon CME of Pediatric Intensive Care 2026.\n\n' +
    'We have received your registration and it has been shared with the organising committee. Once verified you will receive a confirmation text on your whatsapp.\n\n' +
    'Your registration details are as follows:\n' +
    '─────────────────────────────────\n' +
    'Registration ID : ' + serialNumber + '\n' +
    //'Name            : ' + data.firstName + ' ' + data.lastName + '\n' +
    //'Email           : ' + data.email + '\n' +
    //'Phone           : ' + data.phone + '\n' +
    //'Affiliation     : ' + data.affiliation + '\n' +
    //'Role            : ' + data.role + '\n' +
    'Attending       : ' + data.attendingType + '\n' +
    (data.workshopName ? 'Workshop        : ' + data.workshopName + '\n' : '') +
    //'Food Preference : ' + data.foodPreference + '\n' +
    'Amount Paid     : ₹' + data.amount + '\n' +
    '─────────────────────────────────\n\n' +
    'You can download your QR code from the following link: ' + savedQrUrl + '\n\n' +
    (finalQrPic ? 'Please keep this email for your records and present the attached QR code at the venue.\n\n' : 'Please keep this email for your records.\n\n') +
    'Event Details:\n' +
    'Workshops : 13th June 2026 (Saturday)\n' +
    'Conference: 14th June 2026 (Sunday)\n' +
    'Venue     : The Park, Kolkata\n\n' +
    'We look forward to welcoming you!\n\n' +
    'Best regards,\n' +
    'Organizing Committee\n' +
    'Monsoon CME of Pediatric Intensive Care 2026\n' +
    'Society of Pediatric Intensive Care, Kolkata (SPICK)';

  let htmlBody = plainBody.replace(/\n/g, '<br>');
  if (finalQrPic) {
    htmlBody += '<br><br><b>Your Event QR Code:</b><br><img src="cid:qrCode" alt="Event QR Code" style="width:200px; height:200px; border:1px solid #ccc;"/><br><small>Your registration QR code is also attached to this email.</small>';
  }

  const emailOptions = {
    to: data.email,
    name: EMAIL_FROM_NAME,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody
  };

  if (finalQrPic) {
    emailOptions.inlineImages = { qrCode: inlineBlob };
    emailOptions.attachments = [attachBlob];
  }

  // Only add CC/BCC if they are configured (not placeholders and not empty)
  if (typeof EMAIL_CC !== 'undefined' && EMAIL_CC && !EMAIL_CC.includes('placeholder')) {
    emailOptions.cc = EMAIL_CC;
  }
  if (typeof EMAIL_BCC !== 'undefined' && EMAIL_BCC && !EMAIL_BCC.includes('placeholder')) {
    emailOptions.bcc = EMAIL_BCC;
  }

  MailApp.sendEmail(emailOptions);
}

// ============================================================
// LOGIN USER (for document submission portal)
// ============================================================
function loginUser(data) {
  if (!data || !data.email || !data.password) {
    return { success: false, message: 'Email and password are required.' };
  }

  const sheet = getSheet('Registrations');
  if (!sheet) return { success: false, message: 'Could not access registration sheet.' };

  const allData = sheet.getDataRange().getValues();

  for (let i = 1; i < allData.length; i++) {
    // Email = column D (index 3), Password = column H (index 7)
    if (allData[i][3] === data.email && allData[i][7] === data.password) {
      return {
        success: true,
        serialNumber: allData[i][0],
        name: allData[i][1] + ' ' + allData[i][2],
        email: allData[i][3],
        role: allData[i][8],
        attendingType: allData[i][9]
      };
    }
  }

  return { success: false, message: 'Invalid email or password.' };
}

// ============================================================
// UPLOAD ABSTRACT (for dashboard)
// ============================================================
function uploadAbstract(data) {
  if (!data || !data.email || !data.file) {
    return { success: false, message: 'Email and file are required.' };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    // Upload file to Google Drive
    const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
    const fileName = 'Abstract_' + new Date().getTime() + '_' + data.file.fileName;
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.file.base64),
      data.file.mimeType,
      fileName
    );
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    const fileUrl = file.getUrl();

    // Log to Abstracts sheet
    const sheet = getAbstractsSheet();
    sheet.appendRow([
      fileId,
      data.email,
      data.file.fileName,
      fileUrl,
      new Date()
    ]);

    return {
      success: true,
      message: 'Abstract uploaded successfully!',
      fileUrl: fileUrl
    };

  } catch (e) {
    console.log('Error in uploadAbstract: ' + e.toString());
    return { success: false, message: 'Upload failed: ' + e.toString() };
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
// GET MY FILES (for dashboard)
// ============================================================
function getMyFiles(data) {
  if (!data || !data.email) {
    return { success: false, message: 'Email is required.' };
  }

  try {
    const sheet = getAbstractsSheet();
    const allData = sheet.getDataRange().getValues();
    const files = [];

    for (let i = 1; i < allData.length; i++) {
      // UserID (email) is column B (index 1)
      if (allData[i][1] === data.email) {
        files.push({
          fileId: allData[i][0],
          fileName: allData[i][2],
          fileUrl: allData[i][3],
          uploadDate: Utilities.formatDate(new Date(allData[i][4]), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a')
        });
      }
    }

    return { success: true, files: files };

  } catch (e) {
    console.log('Error in getMyFiles: ' + e.toString());
    return { success: false, message: 'Could not load files: ' + e.toString() };
  }
}

// ============================================================
// HELPER — Get or Create Abstracts Sheet
// ============================================================
function getAbstractsSheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Abstracts');
  if (!sheet) {
    sheet = ss.insertSheet('Abstracts');
    sheet.appendRow(['FileID', 'UserID', 'FileName', 'FileUrl', 'UploadDate']);
    sheet.setFrozenRows(1);
    console.log('Created new Abstracts sheet');
  }
  return sheet;
}
