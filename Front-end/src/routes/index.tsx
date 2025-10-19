import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { 
  Stethoscope, 
  Smartphone, 
  Wifi, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Heart,
  Users,
  Calendar,
  Target,
  Eye
} from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const homeRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <Header 
        onNavigate={scrollToSection}
        homeRef={homeRef}
        featuresRef={featuresRef}
        aboutRef={aboutRef}
        contactRef={contactRef}
      />

      {/* Hero Section */}
      <section
        ref={homeRef}
        className="relative overflow-hidden bg-teal-50"
        aria-label="Hero"
      >
        {/* subtle medical grid + soft blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] bg-[linear-gradient(to_right,rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>

        <div className="container mx-auto px-6 py-20 md:py-28">
          <motion.div 
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900"
              variants={fadeInUp}
            >
              Revolutionary Digital Stethoscope
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-700 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Experience the future of cardiac diagnostics. Crystal-clear audio, online consultations, 
              and instant prescriptions—all in one device.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* white wave transition to page background */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -mb-px">
          <svg className="block w-full h-16 md:h-24" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,0 C300,80 600,100 900,60 C1140,30 1290,10 1440,0 L1440,100 L0,100 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className=" py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cutting-Edge Features</h2>
            <p className="text-lg text-gray-600">
              Discover the innovative technology that makes Kalafo the most advanced digital 
              stethoscope for modern healthcare professionals.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">Advanced Audio Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    Crystal-clear digital audio with noise cancellation and amplification for 
                    precise cardiac assessment.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <Smartphone className="h-6 w-6 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">Mobile Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    Seamlessly connect to iOS and Android devices for real-time monitoring 
                    and data sharing.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-none shadow-sm h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <Wifi className="h-6 w-6 text-sky-600" />
                  </div>
                  <CardTitle className="text-xl">Wireless Connectivity</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    Bluetooth and Wi-Fi enabled for effortless data transmission and 
                    remote consultations.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About Kalafo</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We are a health-tech company developing end-to-end solutions for accessible healthcare. 
                Our flagship innovation is a digital stethoscope, integrated with a telehealth platform 
                that enables real-time, one-on-one doctor consultations.
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 gap-8 mb-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm h-full">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                      <Target className="h-5 w-5 text-sky-600" />
                    </div>
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      At Kalafo, our mission is to improve access to healthcare. We believe that 
                      everyone deserves quality medical care, regardless of their location or circumstances.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <Card className="border-none shadow-sm h-full">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                      <Eye className="h-5 w-5 text-sky-600" />
                    </div>
                    <CardTitle className="text-2xl">Our Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      To be the most patient-centric company in the world. We envision a future where 
                      healthcare is accessible, affordable, and personalized for everyone.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="mx-auto h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">100+</div>
                <div className="text-sm text-gray-600">Patients</div>
              </motion.div>
              
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="mx-auto h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">1</div>
                <div className="text-sm text-gray-600">Year of Innovation</div>
              </motion.div>
              
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="mx-auto h-12 w-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Stethoscope className="h-6 w-6 text-teal-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">10+</div>
                <div className="text-sm text-gray-600">Healthcare Professionals</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600">
              Ready to revolutionize your practice with Kalafo? Contact us today to learn more 
              about our digital stethoscope and how it can enhance your patient care.
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Contact Info */}
            <motion.div className="space-y-6" variants={fadeInUp}>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Email Us</CardTitle>
                      <CardDescription>Get in touch with our team</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a href="mailto:contact@kalafo.com" className="text-sky-600 hover:underline">
                    contact@kalafo.com
                  </a>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Call Us</CardTitle>
                      <CardDescription>Speak with our specialists</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a href="tel:+27121234567" className="text-sky-600 hover:underline">
                    +27 (12) 123-4567
                  </a>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Visit Us</CardTitle>
                      <CardDescription>Our headquarters</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">1 Jan Smuts Avenue, Johannesburg</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-sky-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Business Hours</CardTitle>
                      <CardDescription>We're here to help</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Mon-Fri: 8AM-5PM</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Your company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message"
                        placeholder="Tell us about your needs..." 
                        className="min-h-[120px]"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}