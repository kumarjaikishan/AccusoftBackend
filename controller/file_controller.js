const File = require('../modals/file_schema');
// const sendEmail = require('../utils/email');
const { putObjectUrls } = require('../utils/s3');
const asyncHandler = require('../utils/asyncHandler')

// Create a new file entry
const createFileJob = asyncHandler(async (req, res) => {
    const { files: fileUrls, emailRecipients, days } = req.body;

    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
        return next({ status: 400, message: 'fileUrls must be a non-empty array' });
    }

    const currentDate = new Date();
    const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + parseInt(days)));

    const file = new File({
        userid: req.userid,
        fileUrls,
        emailRecipients,
        expiryDate,
        days
    });

    await file.save();
    return res.status(201).json({ message: 'Files Job created successfully' });
});

const createFileurl = asyncHandler(async (req, res) => {
    const { files } = req.body;

    if (!files || files.length === 0) {
        return next({ status: 400, message: 'No files provided' });
    }

    const urls = await putObjectUrls(files);

    return res.status(201).json({ message: 'Files created successfully', urls });
});

const deleteFileJob = asyncHandler(async (req, res) => {

    const filejobs = await File.findByIdAndDelete({ _id: req.body.jobid });  // You already created this function

    return res.status(201).json({ message: 'Job Deleted Successfull' });
});
const getFilejobs = asyncHandler(async (req, res) => {

    const filejobs = await File.find({ userid: req.userid });  // You already created this function

    return res.status(201).json({ filejobs });
});

// update timer
const updateTimerall = asyncHandler(async (req, res) => {

    // Fetch all file jobs related to the user
    const fileJobs = await File.find({ userid: req.userid });

    if (!fileJobs || fileJobs.length === 0) {
        return next({ status: 400, message: 'No file jobs found for this user' });
    }

    const currentDate = new Date();
    const updatedJobs = await Promise.all(
        fileJobs.map(async (job) => {
            const newExpiryDate = new Date(currentDate);
            newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(job.days));
            // newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(13));

            job.expiryDate = newExpiryDate;

            await job.save();
            return job;
        })
    );

    return res.status(201).json({
        message: 'Timer Updated successfully'
    });
});
const updateoneTimer = asyncHandler(async (req, res) => {
    const fileJob = await File.findById(req.body.jobid);
    const currentDate = new Date();
    const newExpiryDate = new Date(currentDate);
    newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(fileJob.days));
    // newExpiryDate.setDate(newExpiryDate.getDate() + parseInt(10));
    const fileJobs = await File.findByIdAndUpdate({ _id: req.body.jobid }, { expiryDate: newExpiryDate });

    return res.status(201).json({
        message: 'Timer Updated successfully',
    });
});


// Cron job to send expired files when the expiry date has passed
const sendExpiredFiles = async () => {
    const now = new Date();

    const expiredFiles = await File.find({ expiryDate: { $lte: now }, sent: false });

    for (let file of expiredFiles) {
        for (let recipient of file.emailRecipients) {
            const filesText = file.fileUrls.map((url, index) => `File ${index + 1}: ${url}`).join('\n');
            // await sendEmail(
            //     recipient,
            //     'Your scheduled files are being sent',
            //     `The files you scheduled are now being sent:\n\n${filesText}`
            // );
        }

        file.sent = true;
        await file.save();
    }
};

module.exports = { createFileJob, deleteFileJob, getFilejobs, sendExpiredFiles, updateTimerall, createFileurl, updateoneTimer };
