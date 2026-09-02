// src/pages/AboutPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBullseye,
  FaEye,
  FaHandshake,
  FaUsers,
  FaShieldAlt,
  FaRocket,
  FaNetworkWired,
  FaLightbulb,
  FaEnvelopeOpenText,
} from 'react-icons/fa';
import Testimonials from '../components/sections/Testimonials';

const AboutPage = () => {
  // =========================================================
  // PAGE META
  // =========================================================
  useEffect(() => {
    document.title = 'About ScaleLink Alliance | Your Business Growth Partner';

    const description =
      'ScaleLink Alliance helps businesses grow through strategic relationships, trusted partnerships, and professional business services designed around real business needs.';

    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', description);
  }, []);

  // =========================================================
  // LEADERSHIP TEAM
  // =========================================================
  const teamMembers = [
    {
      name: 'Eugene Joseph',
      role: 'Interim CEO & Marketing Director',
      bio: "Leads ScaleLink Alliance's growth, marketing, and digital strategy, with a focus on expanding professional services, strengthening partnerships, and building systems that help businesses scale.",
      image:
        'https://www.image2url.com/r2/default/images/1788291934550-d4d9dd45-2b27-40a0-94f3-c267bef2282e.png',
    },
    {
      name: 'Sarah Chen',
      role: 'Chief Operations Officer',
      bio: 'Operations specialist with expertise in scaling professional networks and service organizations. Manages chapter operations and member experience.',
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Chapter Development',
      bio: 'Former franchise executive with a passion for building sustainable business communities. Leads chapter expansion and director training.',
      image:
        'https://image2url.com/r2/default/images/1773327055941-a6784d9c-e5bf-456e-953f-956fb3a54448.jpg',
    },
    {
      name: 'Jessica Williams',
      role: 'Director of Member Success',
      bio: 'Customer success expert focused on maximizing member ROI and satisfaction. Manages onboarding and ongoing member support.',
      image:
        'https://image2url.com/r2/default/images/1773233371381-156d4945-e7d0-4045-b6df-ba72531015ee.jpg',
    },
  ];

  // =========================================================
  // CORE VALUES
  // =========================================================
  const values = [
    {
      icon: <FaNetworkWired />,
      title: 'Intentional Connections',
      description:
        'Quality over quantity — every connection has a purpose, and every interaction adds value.',
    },
    {
      icon: <FaHandshake />,
      title: 'Strategic Collaboration',
      description:
        'Growth through alignment with the right people, systems, and opportunities.',
    },
    {
      icon: <FaShieldAlt />,
      title: 'Trust Over Transactions',
      description:
        'Building relationships that last, not simply completing deals.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Smarter Growth',
      description:
        'Focusing on long-term, sustainable growth rather than quick wins.',
    },
  ];

  // =========================================================
  // MILESTONES
  // =========================================================
  const milestones = [
    {
      year: '2016',
      event: 'ScaleLink Alliance Founded',
      description: 'Founded on September 14, 2016 in Elgin, IL.',
    },
    {
      year: '2017',
      event: 'First Chapter Launch',
      description: 'Launched inaugural chapter with 12 founding members.',
    },
    {
      year: '2018',
      event: 'Network Expansion',
      description: 'Expanded to 5 chapters across the Midwest.',
    },
    {
      year: '2019',
      event: 'Services Division Launch',
      description: 'Added professional business services division.',
    },
    {
      year: '2020',
      event: 'National Expansion',
      description: 'Expanded to East and West coasts.',
    },
    {
      year: '2021',
      event: 'Digital Platform',
      description: 'Launched proprietary referral tracking system.',
    },
    {
      year: '2022',
      event: 'Chapter Director Program',
      description: 'Launched chapter director licensing program.',
    },
    {
      year: '2023',
      event: '25+ Chapters',
      description: 'Grew to 25+ chapters nationwide.',
    },
  ];

  // =========================================================
  // STATS
  // =========================================================
  const stats = [
    {
      number: '500+',
      label: 'Active Members',
    },
    {
      number: '42',
      label: 'Chapters Nationwide',
    },
    {
      number: '$85M+',
      label: 'Business Generated',
    },
    {
      number: '96%',
      label: 'Member Retention Rate',
    },
  ];

  // =========================================================
  // WHO WE SERVE
  // =========================================================
  const audiences = [
    {
      title: 'Business Owners',
      description: 'Looking to scale through strategic partnerships.',
    },
    {
      title: 'Entrepreneurs',
      description: 'Building companies with sustainable growth.',
    },
    {
      title: 'Professionals',
      description: 'Seeking to expand their network and influence.',
    },
    {
      title: 'Growth-Focused Teams',
      description: 'Committed to intentional, results-driven expansion.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 lg:py-24">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                About ScaleLink Alliance
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Where the Right Connections
                <span className="block text-blue-600">
                  Drive Real Growth
                </span>
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                We help businesses scale through intentional connections,
                strategic collaboration, and professional services designed
                around real business needs.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/membership"
                  className="px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Become a Member
                </Link>

                <Link
                  to="/services"
                  className="px-7 py-3.5 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                >
                  Explore Our Services
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE FROM LEADERSHIP
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-blue-100 shadow-xl"
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-blue-200/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-blue-100/40 rounded-full blur-3xl" />

              <div className="relative p-7 md:p-12 lg:p-14">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg rotate-[-3deg]">
                    <FaEnvelopeOpenText className="text-white text-2xl md:text-3xl" />
                  </div>
                </div>

                <div className="text-center mb-10">
                  <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                    Leadership Message
                  </span>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                    A Message From Our Leadership
                  </h2>

                  <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto mt-5" />
                </div>

                <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
                  <p className="text-xl font-semibold text-blue-800">
                    Dear Business Leaders,
                  </p>

                  <p>
                    Every successful business grows through{' '}
                    <strong>relationships, trust, and opportunity</strong>.
                    Yet for many entrepreneurs and professionals, growth is
                    often limited by a simple challenge: accessing the right
                    connections, expertise, and support at the right time.
                  </p>

                  <p>
                    ScaleLink Alliance was created in response to a challenge
                    we continue to see across the business community. Many
                    companies have strong products, valuable expertise, and the
                    ambition to grow. Still, they often lack two critical
                    resources:{' '}
                    <strong>
                      consistent business opportunities and reliable
                      professional support to help them execute and scale.
                    </strong>
                  </p>

                  <p>
                    Traditional networking can create valuable introductions,
                    but connections alone don't always provide the structure or
                    collaboration required to produce meaningful business
                    growth. At the same time, businesses frequently need
                    specialized expertise in areas such as{' '}
                    <strong>
                      technology, marketing, design, automation, content, and
                      operations
                    </strong>{' '}
                    without the expense of building large internal teams.
                  </p>

                  <div className="py-2">
                    <p className="text-xl md:text-2xl font-bold text-blue-700">
                      ScaleLink Alliance was established to help bridge that
                      gap.
                    </p>
                  </div>

                  <p>
                    Our approach brings together two important elements of
                    business growth:
                  </p>

                  <div className="bg-white border border-blue-100 border-l-4 border-l-blue-600 rounded-xl p-6 md:p-7 shadow-sm">
                    <p className="text-lg md:text-xl font-bold text-gray-900">
                      Strategic relationships that create opportunities and
                      professional services that help businesses execute on
                      those opportunities.
                    </p>
                  </div>

                  <p>
                    Through the{' '}
                    <strong>ScaleLink Alliance Network</strong>, businesses
                    can build trusted professional relationships, develop
                    referral opportunities, and connect with other
                    organizations that can contribute to their growth.
                  </p>

                  <p>
                    Through{' '}
                    <strong>ScaleLink Alliance Services</strong>, businesses
                    can access specialized creative, technical, marketing, and
                    operational support when they need it—without necessarily
                    hiring additional employees or coordinating multiple
                    independent providers.
                  </p>

                  <p>
                    But our objective is not simply to provide more connections
                    or complete more projects.
                  </p>

                  <div className="bg-blue-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                    <p className="text-xl md:text-2xl font-bold leading-relaxed">
                      Our focus is helping businesses build stronger systems
                      for sustainable growth.
                    </p>
                  </div>

                  <p>
                    That means understanding the business problem before
                    recommending the solution, connecting businesses with the
                    right opportunities, and ensuring that the services we
                    provide support meaningful business objectives.
                  </p>

                  <p>
                    As{' '}
                    <strong>
                      Interim CEO and Marketing Director
                    </strong>
                    , my responsibility is to continue advancing that mission
                    while strengthening the systems, services, partnerships,
                    and standards behind ScaleLink Alliance.
                  </p>

                  <p>
                    As the organization continues to develop, our commitment
                    remains clear:
                  </p>

                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8">
                    <p className="text-lg md:text-xl font-bold text-blue-800 leading-relaxed">
                      To help businesses grow through strategic relationships,
                      trusted partnerships, and professional services designed
                      around real business needs.
                    </p>
                  </div>

                  <p>
                    Because when businesses have access to both the{' '}
                    <strong>right opportunities and the right execution</strong>
                    , they are better positioned not simply to grow—but to
                    scale.
                  </p>

                  {/* Signature */}
                  <div className="pt-8 mt-8 border-t border-gray-200">
                    <p className="font-medium text-gray-600">Sincerely,</p>

                    <p className="text-2xl font-bold text-blue-700 mt-2">
                      Eugene Joseph
                    </p>

                    <p className="font-semibold text-gray-800">
                      Interim CEO & Marketing Director
                    </p>

                    <p className="text-gray-600">ScaleLink Alliance</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR PURPOSE
      ===================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                  Who We Are
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                  Our Purpose
                </h2>

                <div className="space-y-5 text-gray-600">
                  <p className="text-lg font-medium text-blue-700">
                    ScaleLink Alliance exists for one reason: to help
                    businesses scale through{' '}
                    <strong>
                      intentional connections and strategic collaboration
                    </strong>
                    .
                  </p>

                  <p>
                    We believe growth doesn't come from chasing contacts or
                    surface-level networking—it comes from aligning with the{' '}
                    <strong>
                      right people, systems, and opportunities
                    </strong>
                    .
                  </p>

                  <p>
                    What started as a simple idea has grown into a structured
                    alliance designed to help businesses move from{' '}
                    <strong>stagnation to scale</strong>.
                  </p>
                </div>

                {/* Mission */}
                <div className="mt-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
                    <FaBullseye className="text-blue-600 mr-3" />
                    Our Mission
                  </h3>

                  <div className="bg-white rounded-2xl p-7 shadow-lg border border-gray-100">
                    <p className="text-lg text-gray-700 font-medium">
                      To help business owners and professionals{' '}
                      <strong>scale smarter, not harder</strong>.
                    </p>

                    <ul className="mt-6 space-y-3">
                      {[
                        'Meaningful relationships',
                        'Strategic partnerships',
                        'Long-term, sustainable growth',
                      ].map((item) => (
                        <li key={item} className="flex items-center">
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-3" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-full" />

                <div className="relative bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
                  <div className="flex items-center space-x-3 mb-7">
                    <FaBullseye className="text-3xl" />
                    <h3 className="text-2xl font-bold">Our Bio</h3>
                  </div>

                  <p className="text-blue-50 leading-relaxed">
                    ScaleLink Alliance is a premier networking and business
                    services organization dedicated to helping businesses
                    manage workloads, access specialized expertise, and build
                    meaningful professional relationships.
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/20">
                    <div>
                      <div className="text-3xl font-bold">2016</div>
                      <div className="text-sm text-blue-100 mt-1">
                        Founded
                      </div>
                    </div>

                    <div>
                      <div className="text-3xl font-bold">2</div>
                      <div className="text-sm text-blue-100 mt-1">
                        Divisions
                      </div>
                    </div>

                    <div>
                      <div className="text-3xl font-bold">25+</div>
                      <div className="text-sm text-blue-100 mt-1">
                        Cities
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR JOURNEY
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                Where We Started
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Our Journey
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                ScaleLink Alliance was created after seeing a common problem:
                talented businesses working hard—but growing slowly—because
                they lacked the right network and support.
              </p>

              <p className="text-lg text-gray-600 mt-5 max-w-3xl mx-auto leading-relaxed">
                At the same time, we saw others scale faster through access to
                people, knowledge, and opportunity. That gap became our
                mission.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT MAKES US DIFFERENT
      ===================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                Why ScaleLink
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                What Makes Us Different
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaNetworkWired />,
                  title: 'Not a Generic Networking Group',
                  description:
                    "We're built on quality over quantity, trust over transactions, and growth over noise.",
                },
                {
                  icon: <FaRocket />,
                  title: 'Collaboration with Intention',
                  description:
                    'Every connection has a purpose. Every interaction adds value.',
                },
                {
                  icon: <FaUsers />,
                  title: 'For Growth-Focused Professionals',
                  description:
                    'Serving business owners, entrepreneurs, and professionals who value clarity, alignment, and real progress.',
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="text-blue-600 text-3xl">
                      {item.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CORE VALUES
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                What We Believe
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg text-center border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-blue-600 text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          VISION
      ===================================================== */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-blue-600 to-blue-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <FaEye className="text-4xl" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Vision
              </h2>

              <p className="text-xl md:text-2xl font-semibold mb-7 leading-relaxed">
                We're building a trusted ecosystem where businesses grow
                together, not alone.
              </p>

              <p className="text-xl md:text-2xl font-bold">
                Scale smarter. Connect better. Grow stronger.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHO WE SERVE
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                Built For You
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Who We Serve
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {audiences.map((audience, index) => (
                <motion.div
                  key={audience.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100 hover:bg-blue-100/70 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-5 font-bold">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {audience.title}
                  </h3>

                  <p className="text-gray-600">
                    {audience.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MILESTONES
      ===================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                Our History
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Our Journey in Time
              </h2>
            </div>

            <div className="relative">
              {/* Timeline */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-200 via-blue-500 to-blue-700 rounded-full" />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.05,
                  }}
                  className={`relative flex flex-col md:flex-row items-center mb-12 last:mb-0 ${
                    index % 2 === 0
                      ? 'md:flex-row'
                      : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`md:w-1/2 flex justify-center ${
                      index % 2 === 0
                        ? 'md:justify-end md:pr-12'
                        : 'md:justify-start md:pl-12'
                    } mb-6 md:mb-0`}
                  >
                    <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl border-4 border-white">
                      {milestone.year}
                    </div>
                  </div>

                  <div className="md:w-1/2 px-0 md:px-12">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {milestone.event}
                      </h3>

                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-100">
                Our Results
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
                Our Impact by Numbers
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="text-center text-white"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>

                  <div className="text-base md:text-lg text-blue-100">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ===================================================== */}
      <Testimonials />

      {/* =====================================================
          LEADERSHIP TEAM
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                The People Behind ScaleLink
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Meet Our Leadership Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-72 overflow-hidden bg-gray-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>

                    <div className="text-blue-600 font-semibold mb-4">
                      {member.role}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BUSINESS STRUCTURE
      ===================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold tracking-widest uppercase text-blue-600">
                How We're Organized
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Our Business Structure
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-7 md:p-10 border border-gray-100">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ScaleLink Alliance
                  <span className="text-blue-600"> (Parent Brand)</span>
                </h3>

                <p className="text-gray-600 mb-7">
                  We operate two clear business lines under one unified brand.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                  {/* Network */}
                  <div className="border-2 border-blue-200 rounded-2xl p-7 bg-blue-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <FaNetworkWired />
                      </div>

                      <h4 className="text-lg font-bold text-blue-800">
                        ScaleLink Alliance Network
                      </h4>
                    </div>

                    <p className="text-gray-700 mb-5 font-medium">
                      Chapters & Membership — referral-based growth
                    </p>

                    <ul className="space-y-3 text-gray-600">
                      {[
                        'Local chapters with weekly meetings',
                        'Industry exclusivity protection',
                        'Structured referral exchange',
                      ].map((item) => (
                        <li key={item} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services */}
                  <div className="border-2 border-gray-200 rounded-2xl p-7 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-gray-800 text-white flex items-center justify-center">
                        <FaRocket />
                      </div>

                      <h4 className="text-lg font-bold text-gray-800">
                        ScaleLink Alliance Services
                      </h4>
                    </div>

                    <p className="text-gray-700 mb-5 font-medium">
                      On-demand business & marketing execution
                    </p>

                    <ul className="space-y-3 text-gray-600">
                      {[
                        'No membership required',
                        'Creative, marketing & operational services',
                        'Standalone from networking division',
                      ].map((item) => (
                        <li key={item} className="flex items-start">
                          <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Clarifier */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl">
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Important Clarifier
                </h4>

                <p className="text-gray-700 leading-relaxed">
                  <strong>Not interested in networking? No problem.</strong>{' '}
                  Many businesses work with ScaleLink Alliance only for
                  services. Membership and chapters are optional, not
                  required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}
      <section className="relative overflow-hidden py-24 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white pointer-events-none" />

        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <span className="inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-5">
                Ready for what's next?
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Ready to Scale Smarter?
              </h2>

              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join a network where connections have purpose and growth has
                structure—or access the professional services you need to
                move your business forward.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/membership"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Become a Member
                </Link>

                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
