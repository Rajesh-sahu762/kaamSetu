import { useMemo, useState, useEffect } from 'react';

import Fade from '@/components/common/Fade';
import Avatar from '@/components/common/Avatar';

import { T, MOBILE_BOTTOM_NAV_HEIGHT } from '@/utils/vendorTheme';
import useBreakpoint from '@/utils/useBreakpoint';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  getVendorReviews,
  replyReview,
  reportReview,
} from '@/services/vendorService';

import { toast } from 'react-toastify';

import {
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  MessageSquare,
  Camera,
  Flag,
  ThumbsUp,
  BadgeCheck,
  Send,
  X,
} from 'lucide-react';

/* -------------------------------------------------- */
/* Dummy Data                                         */
/* -------------------------------------------------- */

const FILTERS = ['All', '5 Star', '4 Star', '3 Star', 'With Photos'];



/* -------------------------------------------------- */
/* Small building blocks                              */
/* -------------------------------------------------- */

function StatPill({ label, value, sub }) {
  return (
    <div>
      <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: '0.02em' }}>
        {label}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: 'Geist,sans-serif',
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: 10, opacity: 0.8, fontSize: 13 }}>{sub}</div>
      )}
    </div>
  );
}

function StarRow({ rating, size = 15 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? T.bronze : 'none'}
          color={i < rating ? T.bronze : T.border}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------- */
/* Main component                                     */
/* -------------------------------------------------- */

export default function Reviews() {
  const bp = useBreakpoint();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [openReplyId, setOpenReplyId] = useState(null);
  const [draft, setDraft] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [showReportModal, setShowReportModal] = useState(false);

  const [selectedReview, setSelectedReview] = useState(null);

  const [reportReason, setReportReason] = useState('Spam');

  const [reportLoading, setReportLoading] = useState(false);

  const handleReportReview = async () => {
    if (!selectedReview) return;

    setReportLoading(true);

    const response = await reportReview(selectedReview._id, reportReason);

    if (response.success) {
      toast.success(response.message);

      setShowReportModal(false);

      fetchReviews();
    } else {
      toast.error(response.message);
    }

    setReportLoading(false);
  };

  const fetchReviews = async () => {
    setLoading(true);

    const response = await getVendorReviews({
      page,

      search,

      rating: filter === 'All' ? 'all' : filter.replace(' Star', ''),
    });

    if (response.success) {
      setReviews(response.data);

      setStats(response.stats);

      setPagination(response.pagination);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [page, search, filter]);

const ratingDistribution = [

{

star:5,

count:stats.ratingDistribution?.[5] || 0,

},

{

star:4,

count:stats.ratingDistribution?.[4] || 0,

},

{

star:3,

count:stats.ratingDistribution?.[3] || 0,

},

{

star:2,

count:stats.ratingDistribution?.[2] || 0,

},

{

star:1,

count:stats.ratingDistribution?.[1] || 0,

},

];


const MAX_DISTRIBUTION = Math.max(...ratingDistribution.map((r) => r.count));

  const filteredReviews = reviews;

  const pendingReplies = stats.pendingReplies || 0;

  function openReply(review) {
    setOpenReplyId(review._id);

    setDraft(review.vendorReply || '');
  }

  const sendReply = async (reviewId) => {
    if (!draft.trim()) return;

    const response = await replyReview(reviewId, draft);

    if (response.success) {
      toast.success(response.message);

      setOpenReplyId(null);

      setDraft('');

      fetchReviews();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div
      style={{
        padding: bp.isMobile ? 16 : 24,
        paddingBottom: bp.isMobile ? MOBILE_BOTTOM_NAV_HEIGHT + 24 : 24,
        fontFamily: 'Inter,sans-serif',
      }}
    >
      {/* Local styles for hover states the inline-style system can't express */}
      <style>{`
        .rv-card { transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease; }
        .rv-card:hover { box-shadow: 0 20px 40px -24px rgba(9,20,38,.18); transform: translateY(-2px); border-color: ${T.bronze}55; }
        .rv-chip { transition: background .15s ease, color .15s ease, border-color .15s ease; }
        .rv-icon-btn { transition: background .15s ease, color .15s ease; }
        .rv-icon-btn:hover { background: ${T.bronze}1a; color: ${T.bronze}; }
        .rv-input:focus { border-color: ${T.slate} !important; }
        .rv-fab { transition: transform .15s ease; }
        .rv-fab:active { transform: scale(0.94); }
      `}</style>

      {/* ================= Header ================= */}
      <Fade>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Geist,sans-serif',
                fontSize: bp.isMobile ? 26 : 30,
                fontWeight: 600,
                color: T.slate,
                letterSpacing: '-0.01em',
              }}
            >
              Reviews
            </h1>
            <p style={{ marginTop: 6, color: T.slateGray, fontSize: 14 }}>
              See customer feedback and improve your business.
            </p>
          </div>

          <button
            style={{
              height: 44,
              padding: '0 20px',
              border: 'none',
              borderRadius: 8,
              background: T.slate,
              color: T.white,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <MessageSquare size={17} />
            Reply Queue
            {pendingReplies > 0 && (
              <span
                style={{
                  background: T.bronze,
                  color: T.white,
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: '2px 8px',
                  marginLeft: 2,
                }}
              >
                {pendingReplies}
              </span>
            )}
          </button>
        </div>
      </Fade>

      {/* ================= Hero summary banner ================= */}
      <Fade delay={0.08}>
        <div
          style={{
            marginTop: 24,
            background: T.slate,
            borderRadius: 20,
            padding: 26,
            color: T.white,
            display: 'grid',
            gridTemplateColumns: bp.isDesktop ? '2fr 1fr 1fr' : '1fr',
            gap: 24,
          }}
        >
          <div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Overall Rating</div>
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <h2
                style={{
                  fontSize: 46,
                  fontFamily: 'Geist,sans-serif',
                  fontWeight: 700,
                }}
              >
                {stats.averageRating || 0}
              </h2>
              <StarRow rating={5} size={18} />
            </div>
            <p style={{ marginTop: 10, opacity: 0.8, fontSize: 14 }}>
              Based on {stats.totalReviews || 0} reviews.
            </p>
          </div>

          <StatPill
            label="Review Growth"
            value="+18%"
            sub={
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp size={16} /> This month
              </span>
            }
          />

          <StatPill
            label="Recommendation"
            value="92%"
            sub="Customers recommend you."
          />
        </div>
      </Fade>

      {/* ================= Quick stat cards ================= */}
      <Fade delay={0.12}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: bp.isDesktop
              ? 'repeat(4,1fr)'
              : 'repeat(2,1fr)',
            gap: 18,
            marginTop: 24,
          }}
        >
          {[
            { title: 'Total Reviews', value: stats.totalReviews },
            { title: 'Average Rating', value: stats.averageRating},
            { title: 'Photos Shared', value: stats.pendingReplies},
            { title: 'Reply Rate', value: '96%' },
          ].map((item) => (
            <div
              key={item.title}
              className="rv-card"
              style={{
                background: T.white,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 13, color: T.slateGray }}>
                {item.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: 'Geist,sans-serif',
                  fontSize: bp.isMobile ? 26 : 32,
                  fontWeight: 700,
                  color: T.slate,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Fade>

      
      {/* ================= Search + Filters ================= */}
      <Fade delay={0.25}>
        <div style={{ marginTop: 26 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: T.slateGray,
              }}
            />
            <input
              className="rv-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer or service..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 46px',
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                outline: 'none',
                background: T.white,
                fontSize: 14,
                color: T.slate,
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              overflowX: 'auto',
              marginTop: 18,
              paddingBottom: 6,
            }}
          >
            {FILTERS.map((item) => (
              <button
                key={item}
                className="rv-chip"
                onClick={() => setFilter(item)}
                style={{
                  border: filter === item ? 'none' : `1px solid ${T.border}`,
                  background: filter === item ? T.bronze : T.white,
                  color: filter === item ? T.white : T.slate,
                  padding: '10px 18px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Fade>

      {/* ================= Reviews list ================= */}
      <Fade delay={0.3}>
        <div style={{ marginTop: 28 }}>
          {filteredReviews.map((review) => {
            const isOpen = openReplyId === review._id;
            const savedReply = review.vendorReply;

            return (
              <div
                key={review.id}
                className="rv-card"
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 22,
                  marginBottom: 18,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 18,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Avatar initials={review.customerId.fullName

.split(" ")

.map(word=>word[0])

.join("")} size={52} />
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: 'Geist,sans-serif',
                            fontSize: 17,
                            fontWeight: 600,
                            color: T.slate,
                          }}
                        >
                          {review.customerId.fullName}
                        </h3>

                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginTop: 8,
                          flexWrap: 'wrap',
                        }}
                      >
                        <StarRow rating={review.rating} />
                        <span style={{ color: T.slateGray, fontSize: 13 }}>
                          {review.serviceId.serviceName}
                        </span>
                        <span style={{ color: T.slateGray, fontSize: 13 }}>
                          •
                        </span>
                        <span style={{ color: T.slateGray, fontSize: 13 }}>
                          {new Date(

review.createdAt

).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openReply(review)}
                    style={{
                      border: `1px solid ${savedReply ? T.border : T.slate}`,
                      background: savedReply ? T.white : T.slate,
                      color: savedReply ? T.slate : T.white,
                      borderRadius: 10,
                      padding: '9px 16px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {savedReply ? 'Edit Reply' : 'Reply'}
                  </button>
                </div>

                {/* Review body */}
                <p
                  style={{
                    marginTop: 20,
                    color: T.slateGray,
                    lineHeight: 1.8,
                    fontSize: 14,
                  }}
                >
                  {review.review}
                </p>

                {/* Vendor reply, if any */}
                {savedReply && !isOpen && (
                  <div
                    style={{
                      marginTop: 16,
                      background: T.surfaceLow,
                      borderRadius: 12,
                      padding: 16,
                      borderLeft: `3px solid ${T.bronze}`,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: T.slate,
                        marginBottom: 6,
                        letterSpacing: '0.02em',
                      }}
                    >
                      YOUR REPLY
                    </div>
                    <div
                      style={{
                        color: T.slateGray,
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {savedReply}
                    </div>
                  </div>
                )}

                {/* Reply composer */}
                {isOpen && (
                  <div
                    style={{
                      marginTop: 16,
                      background: T.surfaceLow,
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <textarea
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Write a reply to ${review.customerId.fullName}...`}
                      rows={3}
                      style={{
                        width: '100%',
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: 12,
                        outline: 'none',
                        fontFamily: 'Inter,sans-serif',
                        fontSize: 14,
                        resize: 'vertical',
                        background: T.white,
                        color: T.slate,
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10,
                        marginTop: 10,
                      }}
                    >
                      <button
                        onClick={() => {
                          setOpenReplyId(null);
                          setDraft('');
                        }}
                        style={{
                          border: `1px solid ${T.border}`,
                          background: T.white,
                          color: T.slate,
                          borderRadius: 10,
                          padding: '9px 16px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => sendReply(review._id)}
                        disabled={!draft.trim()}
                        style={{
                          border: 'none',
                          background: T.bronze,
                          color: T.white,
                          borderRadius: 10,
                          padding: '9px 16px',
                          cursor: draft.trim() ? 'pointer' : 'not-allowed',
                          opacity: draft.trim() ? 1 : 0.6,
                          fontWeight: 600,
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Send size={14} />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom actions */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    marginTop: 20,
                    gap: 14,
                    flexWrap: 'wrap',
                  }}
                >

                  <button
                    disabled={review.isReported}
                    onClick={() => {
                      setSelectedReview(review);

                      setReportReason('Spam');

                      setShowReportModal(true);
                    }}
                    style={{
                      display: 'flex',

                      alignItems: 'center',

                      gap: 8,

                      border: 'none',

                      background: 'transparent',

                      color: review.isReported ? T.slateGray : T.red,

                      cursor: review.isReported ? 'not-allowed' : 'pointer',

                      fontSize: 13,

                      fontWeight: 600,
                    }}
                  >
                    <Flag size={15} />

                    {review.isReported ? 'Reported' : 'Report'}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredReviews.length === 0 && (
            <div
              style={{
                marginTop: 20,
                background: T.white,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                padding: 60,
                textAlign: 'center',
              }}
            >
              <MessageSquare size={44} color={T.slateGray} />
              <h2
                style={{
                  marginTop: 18,
                  fontFamily: 'Geist,sans-serif',
                  color: T.slate,
                  fontSize: 18,
                }}
              >
                No reviews found
              </h2>
              <p style={{ marginTop: 8, color: T.slateGray, fontSize: 14 }}>
                Try a different search term or filter.
              </p>
            </div>
          )}
        </div>
      </Fade>

      {/* ================= Distribution + AI Insights ================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: bp.isDesktop ? '1.5fr 1fr' : '1fr',
          gap: 24,
          marginTop: 26,
        }}
      >
        <Fade delay={0.15}>
          <div
            style={{
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: 18,
              padding: 22,
              height: '100%',
            }}
          >
            <h3
              style={{
                fontFamily: 'Geist,sans-serif',
                fontSize: 18,
                color: T.slate,
                marginBottom: 20,
              }}
            >
              Rating Distribution
            </h3>

            {ratingDistribution.map((item) => {
              const percent = (item.count / MAX_DISTRIBUTION) * 100;
              return (
                <div
                  key={item.star}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 18,
                  }}
                >
                  <div style={{ width: 50, fontWeight: 600, color: T.slate }}>
                    {item.star} ★
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 10,
                      borderRadius: 999,
                      background: T.surfaceLow,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: T.bronze,
                        borderRadius: 999,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: 42,
                      textAlign: 'right',
                      fontSize: 13,
                      color: T.slateGray,
                    }}
                  >
                    {item.count}
                  </div>
                </div>
              );
            })}
          </div>
        </Fade>

        <Fade delay={0.2}>
          <div
            style={{
              background: T.white,
              border: `1px solid ${T.border}`,
              borderRadius: 18,
              padding: 22,
              height: '100%',
            }}
          >
            <h3
              style={{
                fontFamily: 'Geist,sans-serif',
                color: T.slate,
                marginBottom: 20,
                fontSize: 18,
              }}
            >
              AI Insights
            </h3>

            <div
              style={{
                background: T.greenDim,
                borderRadius: 12,
                padding: 16,
                marginBottom: 18,
              }}
            >
              <div
                style={{ fontWeight: 600, color: T.green, marginBottom: 10 }}
              >
                Customers Love
              </div>
              <ul
                style={{
                  paddingLeft: 18,
                  color: T.slateGray,
                  lineHeight: 1.9,
                  margin: 0,
                }}
              >
                <li>Professional behaviour</li>
                <li>Quality of work</li>
                <li>On-time arrival</li>
                <li>Clean finishing</li>
              </ul>
            </div>

            <div
              style={{ background: T.amberDim, borderRadius: 12, padding: 16 }}
            >
              <div
                style={{ fontWeight: 600, color: T.amber, marginBottom: 10 }}
              >
                Needs Improvement
              </div>
              <ul
                style={{
                  paddingLeft: 18,
                  color: T.slateGray,
                  lineHeight: 1.9,
                  margin: 0,
                }}
              >
                <li>Weekend availability</li>
                <li>Response time</li>
                <li>Price communication</li>
              </ul>
            </div>
          </div>
        </Fade>
      </div>


      
      {/* ================= Mobile filter FAB ================= */}
      {bp.isMobile && (
        <button
          className="rv-fab"
          onClick={() => setShowMobileFilters(true)}
          style={{
            position: 'fixed',
            right: 18,
            bottom: MOBILE_BOTTOM_NAV_HEIGHT + 18,
            width: 58,
            height: 58,
            borderRadius: '50%',
            border: 'none',
            background: T.bronze,
            color: T.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 12px 24px rgba(9,20,38,.28)',
            zIndex: 40,
          }}
        >
          <SlidersHorizontal size={22} />
        </button>
      )}

      {/* ================= Mobile filter bottom sheet ================= */}
      {bp.isMobile && showMobileFilters && (
        <div
          onClick={() => setShowMobileFilters(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9,20,38,.45)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              background: T.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '12px 20px 28px',
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 999,
                background: T.border,
                margin: '0 auto 18px',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Geist,sans-serif',
                  color: T.slate,
                  fontSize: 17,
                }}
              >
                Filter Reviews
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                <X size={20} color={T.slateGray} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FILTERS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setFilter(item);
                    setShowMobileFilters(false);
                  }}
                  style={{
                    textAlign: 'left',
                    border: filter === item ? 'none' : `1px solid ${T.border}`,
                    background: filter === item ? T.bronze : T.white,
                    color: filter === item ? T.white : T.slate,
                    padding: '14px 18px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showReportModal}
        title="Report Review"
        message="Select a reason for reporting this review."
        confirmText="Report"
        cancelText="Cancel"
        danger={true}
        loading={reportLoading}
        onCancel={() => {
          setShowReportModal(false);

          setSelectedReview(null);
        }}
        onConfirm={handleReportReview}
      >
        <select
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          style={{
            width: '100%',

            height: 46,

            border: `1px solid ${T.border}`,

            borderRadius: 10,

            padding: '0 12px',

            fontSize: 14,

            outline: 'none',

            background: T.white,
          }}
        >
          <option value="Spam">Spam</option>

          <option value="Fake Review">Fake Review</option>

          <option value="Abusive Language">Abusive Language</option>

          <option value="Wrong Information">Wrong Information</option>

          <option value="Other">Other</option>
        </select>
      </ConfirmModal>
    </div>
  );
}
