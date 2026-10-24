import Service from '../models/Service.js';
import { findServiceMatch } from '../utils/serviceMatcher.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({ message: 'Invalid service ID', error: error.message });
  }
};

export const searchServices = async (req, res) => {
  const query = req.query.q || '';

  if (!query.toString().trim()) {
    return res.status(400).json({
      message: 'Please provide a search query for the service you need.',
    });
  }

  try {
    const allServices = await Service.find();
    const matchedService = findServiceMatch(query, allServices);

    if (!matchedService) {
      return res.status(404).json({
        message: "Sorry, I couldn't find a matching college service.",
        suggestions: [
          'Exam Form',
          'Bonafide Certificate',
          'Migration Certificate',
          'Degree Certificate',
          'Extra-Curricular Activity Certificate',
        ],
      });
    }

    res.json(matchedService);
  } catch (error) {
    res.status(500).json({ message: 'Error searching services', error: error.message });
  }
};

export const getAnswerContext = async (req, res) => {
  const query = req.query.q || '';

  if (!query.toString().trim()) {
    return res.status(400).json({
      message: 'Please provide a question to generate the AI-ready service context.',
    });
  }

  try {
    const allServices = await Service.find();
    const matchedService = findServiceMatch(query, allServices);

    if (!matchedService) {
      return res.status(404).json({
        message: "I couldn't find verified information for this service. Please check with the concerned college department.",
      });
    }

    const context = {
      question: query,
      serviceName: matchedService.name,
      visitRequired: matchedService.visitRequired,
      onlineAvailable: matchedService.onlineAvailable,
      documents: matchedService.documents,
      procedure: matchedService.procedure,
      fees: matchedService.fees,
      processingTime: matchedService.processingTime,
      department: matchedService.department,
      officeLocation: matchedService.officeLocation,
      onlineApplicationUrl: matchedService.onlineApplicationUrl,
      conditions: matchedService.conditions,
      lastVerified: matchedService.lastVerified,
      status: matchedService.status,
      verificationSource: matchedService.verificationSource,
      aiInstructions: [
        'Use only the verified data below.',
        'Do not invent college-specific fees, office locations, or procedures.',
        'If the record is marked as sample or needs-review, clearly explain that the information is not fully verified.',
      ],
      answerTemplate: `For ${matchedService.name}: the current record shows that a physical visit is ${matchedService.visitRequired.toLowerCase()} and the information was last verified on ${matchedService.lastVerified || 'not provided'}. Use the department, documents, procedure, and conditions exactly as listed in the verified record.`
    };

    res.json(context);
  } catch (error) {
    res.status(500).json({ message: 'Error preparing AI answer context', error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting service', error: error.message });
  }
};
