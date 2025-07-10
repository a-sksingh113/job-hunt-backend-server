import { Request, Response } from 'express';
import JobApplication from '../../models/jobModel/jobApplication';
import JobSeeker from '../../models/authModel/jobSeeker';
import JobOffer from '../../models/jobModel/jobOffer';


export const getAcceptedJobs = async (req: Request, res: Response) => {
  try {
    const jobSeekerId = req.user?.id;
    if (!jobSeekerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const acceptedApplications = await JobApplication.find({
      jobSeekerId,
      status: 'accepted',
    })
      .populate({
        path: 'job',
        select: 'title description location salary jobType domain experienceRequired',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Accepted jobs fetched successfully',
      acceptedJobs: acceptedApplications,
    });
  } catch (error) {
    console.error('Error fetching accepted jobs:', error);
    res.status(500).json({ success: false, message: `Server error: ${error}` });
  }
};

export const getJobOffersForSeeker = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const jobSeeker = await JobSeeker.findOne({ userId });
    if (!jobSeeker) return res.status(404).json({ success: false, message: 'Job seeker not found' });

    const offers = await JobOffer.find({ jobSeekerId: jobSeeker._id })
      .populate('job')
      .populate({
        path: 'employer',
        populate: { path: 'userId', model: 'User', select: 'fullName email' },
      })
      .sort({ sentAt: -1 });

    res.status(200).json({ success: true, jobOffers: offers });
  } catch (error) {
    console.error('Error fetching job offers:', error);
    res.status(500).json({ success: false, message: `Server error: ${error}` });
  }
};

export const getJobOfferById = async (req: Request, res: Response) => {
  try {
    const jobOfferId = req.params.id;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const jobSeeker = await JobSeeker.findOne({ userId });
    if (!jobSeeker) return res.status(404).json({ success: false, message: 'Job seeker not found' });

    const jobOffer = await JobOffer.findOne({ _id: jobOfferId, jobSeekerId: jobSeeker._id })
      .populate('job')
      .populate({
        path: 'employer',
        populate: { path: 'userId', model: 'User', select: 'fullName email' },
      });

    if (!jobOffer) return res.status(404).json({ success: false, message: 'Job offer not found' });

    res.status(200).json({ success: true, jobOffer });
  } catch (error) {
    console.error('Error fetching job offer:', error);
    res.status(500).json({ success: false, message: `Server error: ${error}` });
  }
};

export const updateJobOfferStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const offerId = req.params.id;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const jobOffer = await JobOffer.findById(offerId);
    if (!jobOffer) {
      return res.status(404).json({ success: false, message: 'Job offer not found' });
    }

    jobOffer.status = status;
    jobOffer.respondedAt = new Date();
    await jobOffer.save();

    res.status(200).json({ success: true, message: 'Job offer updated successfully', jobOffer });
  } catch (error) {
    console.error('Error updating job offer status:', error);
    res.status(500).json({ success: false, message: `Server error: ${error}` });
  }
};
